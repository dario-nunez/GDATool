package com.mycompany.jobs;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import org.apache.spark.sql.*;
import org.elasticsearch.action.admin.indices.alias.IndicesAliasesRequest;
import org.elasticsearch.action.admin.indices.alias.get.GetAliasesRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.get.GetIndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.spark.sql.api.java.JavaEsSparkSQL;
import org.slf4j.LoggerFactory;
import scala.collection.Seq;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

public class DataAnalysisJob extends Job {
    private RestHighLevelClient restHighLevelClient;

    public DataAnalysisJob(SparkSession sparkSession, ConfigModel configModel,
                           MongodbRepository mongodbRepository, ElasticsearchRepository elasticsearchRepository,
                           UserDefinedFunctionsFactory userDefinedFunctionsFactory,
                           RestHighLevelClient restHighLevelClient) {
        super(sparkSession, configModel, mongodbRepository, elasticsearchRepository, userDefinedFunctionsFactory);
        this.restHighLevelClient = restHighLevelClient;
        logger = LoggerFactory.getLogger(SchemaInferenceJob.class);
    }

    @Override
    public void run(String userId, String jobId) throws IOException, UnirestException {
        logger.info("job {} by user {} is starting", jobId, userId);

        // Load aggregations
        List<AggregationModel> aggregations = mongodbRepository.loadAggregations(jobId);

        // Load job
        JobModel job = mongodbRepository.getJobById(jobId);

        // Read data
        Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), job.rawInputDirectory));
        dataset = HelperFunctions.getValidDataset(dataset).cache();

        // Iterate through the defined aggregations and perform their gorupby
        for (AggregationModel agg : aggregations) {
            Dataset<Row> groupByDataset = groupBy(dataset, agg).cache();

            long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);

            saveToStaging(groupByDataset, String.format("/%s/%s/staging/%d/%s",
                    userId, jobId, dateEpoch, agg._id));
            if (configModel.elasticsearchUrl() != null && job.generateESIndices) {
                saveToES(groupByDataset, job, agg, restHighLevelClient, dateEpoch);
            }
        }

        if (job.generateESIndices) {
            elasticsearchRepository.generateBasicDashboard(job);
            try {
                restHighLevelClient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        markJobAsComplete(job);
        restHighLevelClient.close();
    }

    /**
     *
     * @param dataset
     * @param aggregationModel
     * @return
     */
    private Dataset<Row> groupBy(Dataset<Row> dataset, AggregationModel aggregationModel) {
        // Feature columns
        List<Column> catColumns = aggregationModel.featureColumns.stream().map(functions::col).collect(Collectors.toList());

        // Creates a Column with the name of the metric column in the AggregationModel
        Column metricColumn = col(aggregationModel.metricColumn);

        logger.info("Grouping by {}", catColumns.stream().map(Column::logName).collect(Collectors.joining(",")));

        // Creates a list of columns with all the feature columns and the one metric column
        List<Column> selColumns = new ArrayList<>(catColumns);
        selColumns.add(metricColumn);

        // Feature columns in an array of Column
        Column[] categoriesColumns = new Column[catColumns.size()];
        for (int i = 0; i < categoriesColumns.length; i++) {
            categoriesColumns[i] = catColumns.get(i);
        }

        // Features and metric columns in an array of Column
        Column[] selectColumns = new Column[selColumns.size()];
        for (int i = 0; i < selColumns.size(); i++) {
            selectColumns[i] = selColumns.get(i);
        }

        // A list of Column objects, one for each operation requested in the AggregationModel
        List<Column> columns = getAggregationColumns(aggregationModel);

        // A scala Seq object containing the operation columns in the AggregationModel
        Seq<Column> aggregationColumns = scala.collection.JavaConversions.asScalaBuffer(columns.subList(1, columns.size()));

        // Ensure feature columns are of type String
        dataset = HelperFunctions.stringifyFeatureColumns(dataset, aggregationModel.featureColumns).cache();

        // A new dataset is created and returned, containing only the feature column and a column for each operation over
        // the metric column/s
        return dataset.select(selectColumns)
                .groupBy(categoriesColumns)
                .agg(columns.get(0), aggregationColumns)
                .sort(desc(aggregationModel.sortColumnName));
    }

    /**
     *
     * @param dataset
     * @param filename
     */
    private void saveToStaging(Dataset<Row> dataset, String filename) {
        // Writing to parquet
        String ext = "parquet";
        String fullFilename = configModel.bucketRoot() + filename + "." + ext;
        logger.info("Writing to {}", fullFilename);
        dataset.write().mode(SaveMode.Overwrite).format(ext).save(fullFilename);
    }

    /**
     *
     * @param dataset
     * @param job
     * @param agg
     * @param hlClient
     * @param dateEpoch
     * @throws IOException
     */
    private void saveToES(Dataset<Row> dataset, JobModel job, AggregationModel agg, RestHighLevelClient hlClient, long dateEpoch) throws IOException {
        String alias = getElasticIndexNamePrefix(agg);
        String indexName = getElasticIndexName(agg, dateEpoch);
        List<String> indices = listIndices(getElasticIndexNamePrefix(agg));

        if (indices.size() > 0) {
            // Delete alias
            deleteAlias(alias, indices.get(indices.size() - 1));
        }

        if (indices.size() > 1) {
            // Delete the oldest index
            String oldIndex = indices.get(indices.size() - 2);
            DeleteIndexRequest request = new DeleteIndexRequest(oldIndex);
            logger.info("Deleting index {}", oldIndex);
            hlClient.indices().delete(request, RequestOptions.DEFAULT);
        }

        GetIndexRequest getIndexRequest = new GetIndexRequest();
        getIndexRequest.indices(indexName);
        logger.info("Creating index {}", indexName);
        JavaEsSparkSQL.saveToEs(dataset, indexName + "/docs");

        // Add new alias
        addAlias(alias, indexName);
    }

    /**
     *
     * @param prefix
     * @return
     * @throws IOException
     */
    private List<String> listIndices(String prefix) throws IOException {
        org.elasticsearch.client.indices.GetIndexRequest getIndexRequest = new org.elasticsearch.client.indices.GetIndexRequest("*");
        org.elasticsearch.client.indices.GetIndexResponse getIndexResponse = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);
        return Arrays.asList(getIndexResponse.getIndices()).stream().filter(index -> index.startsWith(prefix)).sorted().collect(Collectors.toList());
    }

    /**
     *
     * @param alias
     * @param oldIndex
     * @throws IOException
     */
    private void deleteAlias(String alias, String oldIndex) throws IOException {
        if (aliasExists(alias)) {
            IndicesAliasesRequest request = new IndicesAliasesRequest();
            IndicesAliasesRequest.AliasActions deleteAliasAction = new IndicesAliasesRequest.AliasActions(IndicesAliasesRequest.AliasActions.Type.REMOVE)
                    .index(oldIndex).alias(alias);
            request.addAliasAction(deleteAliasAction);
            restHighLevelClient.indices().updateAliases(request, RequestOptions.DEFAULT);
        }
    }

    /**
     *
     * @param alias
     * @param newIndex
     * @throws IOException
     */
    private void addAlias(String alias, String newIndex) throws IOException {
        IndicesAliasesRequest request = new IndicesAliasesRequest();
        IndicesAliasesRequest.AliasActions addAliasAction = new IndicesAliasesRequest.AliasActions(IndicesAliasesRequest.AliasActions.Type.ADD)
                .index(newIndex).alias(alias);
        request.addAliasAction(addAliasAction);
        restHighLevelClient.indices().updateAliases(request, RequestOptions.DEFAULT);
    }

    /**
     *
     * @param alias
     * @return
     * @throws IOException
     */
    private boolean aliasExists(String alias) throws IOException {
        GetAliasesRequest request = new GetAliasesRequest();
        request.aliases(alias);
        return restHighLevelClient.indices().existsAlias(request, RequestOptions.DEFAULT);
    }

    private void markJobAsComplete(JobModel job) throws IOException, UnirestException {
        job.jobStatus = 5;
        mongodbRepository.markJobAsComplete(job);
    }
}
