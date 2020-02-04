package com.mycompany.jobs;

import com.google.inject.Inject;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import com.mycompany.services.bi.BiRepository;
import com.mycompany.services.mongodb.MongodbRepository;
import org.apache.commons.io.FileUtils;
import org.apache.spark.sql.*;
import org.apache.spark.sql.types.DataTypes;
import org.elasticsearch.action.admin.indices.alias.IndicesAliasesRequest;
import org.elasticsearch.action.admin.indices.alias.IndicesAliasesRequest.AliasActions;
import org.elasticsearch.action.admin.indices.alias.get.GetAliasesRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.get.GetIndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.spark.sql.api.java.JavaEsSparkSQL;
import org.slf4j.LoggerFactory;
import scala.collection.Seq;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

public class DefaultJob extends Job {

    private final RestHighLevelClient hlClient;

    @Inject
    public DefaultJob(SparkSession sparkSession, ConfigModel configModel,
                      MongodbRepository mongodbRepository,
                      BiRepository biRepository,
                      UserDefinedFunctionsFactory userDefinedFunctionsFactory,
                      RestHighLevelClient hlClient) {
        super(sparkSession, configModel, mongodbRepository, biRepository, userDefinedFunctionsFactory);
        this.hlClient = hlClient;
        logger = LoggerFactory.getLogger(DefaultJob.class);
    }

    public void run(String jobId, String userId) throws IOException, UnirestException {
        logger.info("job {} by user {} is starting", jobId, userId);
        List<AggregationModel> aggregations = mongodbRepository.loadAggregations(jobId);
        JobModel job = mongodbRepository.getJobById(jobId);

        //Dev path
        Dataset<Row> dataset = read(String.format("%s/%s", configModel.rawFileRoot(), job.rawInputDirectory()));

        //Local path
//        Dataset<Row> dataset = read(String.format("%s/%s/%s/raw/pp-2018-part1.csv", configModel.rawFileRoot(), userId, jobId));

//        List OGDataset = dataset.collectAsList();
//        FileUtils.writeStringToFile(new File(String.format("%s/%s/%s/raw/ogDataset.txt", configModel.rawFilePath(), userId, jobId)), OGDataset.toString());
//
//        //Dataset<Row> filteredDataset = dataset.where("price > 500000");
//        //Dataset<Row> filteredDataset = dataset.where("price = 350000");
//        Dataset<Row> filteredDataset = dataset.where("city = 'NOTTINGHAM'");
//
//        List filteredDatasetList = filteredDataset.collectAsList();
//        FileUtils.writeStringToFile(new File(String.format("%s/%s/%s/raw/filteredDataset.txt", configModel.rawFilePath(), userId, jobId)), filteredDatasetList.toString());

        sparkSession.udf().register("createMonthYearColumn", userDefinedFunctionsFactory.createMonthYearColumn(), DataTypes.StringType);
        dataset = dataset.withColumn("month", callUDF("createMonthYearColumn", col("transferDate"))).cache();

        for (AggregationModel agg : aggregations) {
            Dataset<Row> groupByDataset = groupBy(dataset, agg).cache();

            long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);

            saveToStaging(groupByDataset, String.format("/%s/%s/staging/%d/%s",
                    userId, jobId, dateEpoch, agg._id()));
            if (configModel.elasticsearchUrl() != null && job.generateESIndices()) {
                saveToES(groupByDataset, job, agg, hlClient, dateEpoch);
            }
        }

        if (job.generateESIndices()) {
            biRepository.generateBasicDashboard(job);
            try {
                hlClient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Group by the feature columns and calculate aggregations on the metricColumn
     *
     * @param dataset          Dataset.
     * @param aggregationModel Aggregations specification.
     * @return Dataset resulting from the group by.
     */
    private Dataset<Row> groupBy(Dataset<Row> dataset, AggregationModel aggregationModel) {

        List<Column> catColumns = aggregationModel.featureColumns().stream().map(functions::col).collect(Collectors.toList());
        Column metricColumn = col(aggregationModel.metricColumn());

        logger.info("Grouping by {}", catColumns.stream().map(Column::logName).collect(Collectors.joining(",")));
        List<Column> selColumns = new ArrayList<>(catColumns);
        selColumns.add(metricColumn);

        Column[] categoriesColumns = new Column[catColumns.size()];
        for (int i = 0; i < categoriesColumns.length; i++) {
            categoriesColumns[i] = catColumns.get(i);
        }
        Column[] selectColumns = new Column[selColumns.size()];
        for (int i = 0; i < selColumns.size(); i++) {
            selectColumns[i] = selColumns.get(i);
        }

        List<Column> columns = getAggregationColumns(aggregationModel);
        Seq<Column> aggregationColumns = scala.collection.JavaConversions.asScalaBuffer(columns.subList(1, columns.size()));

        return dataset.select(selectColumns)
                .groupBy(categoriesColumns)
                .agg(columns.get(0), aggregationColumns)
                .sort(desc(aggregationModel.sortColumnName()));
    }

    /**
     * Write to staging in parquet format
     */
    private void saveToStaging(Dataset<Row> dataset, String filename) {
        // Writing to parquet
        String ext = "parquet";
        String fullFilename = configModel.stagingFolder() + filename + "." + ext;
        logger.info("Writing to {}", fullFilename);
        dataset.write().mode(SaveMode.Overwrite).format(ext).save(fullFilename);
    }

    /**
     * Create the ES index
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

    private List<String> listIndices(String prefix) throws IOException {
        org.elasticsearch.client.indices.GetIndexRequest getIndexRequest = new org.elasticsearch.client.indices.GetIndexRequest("*");
        org.elasticsearch.client.indices.GetIndexResponse getIndexResponse = hlClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);
        return Arrays.asList(getIndexResponse.getIndices()).stream().filter(index -> index.startsWith(prefix)).sorted().collect(Collectors.toList());
    }

    private void deleteAlias(String alias, String oldIndex) throws IOException {
        if (aliasExists(alias)) {
            IndicesAliasesRequest request = new IndicesAliasesRequest();
            AliasActions deleteAliasAction = new AliasActions(AliasActions.Type.REMOVE)
                    .index(oldIndex).alias(alias);
            request.addAliasAction(deleteAliasAction);
            hlClient.indices().updateAliases(request, RequestOptions.DEFAULT);
        }
    }

    private void addAlias(String alias, String newIndex) throws IOException {
        IndicesAliasesRequest request = new IndicesAliasesRequest();
        AliasActions addAliasAction = new AliasActions(AliasActions.Type.ADD)
                .index(newIndex).alias(alias);
        request.addAliasAction(addAliasAction);
        hlClient.indices().updateAliases(request, RequestOptions.DEFAULT);
    }

    private boolean aliasExists(String alias) throws IOException {
        GetAliasesRequest request = new GetAliasesRequest();
        request.aliases(alias);
        return hlClient.indices().existsAlias(request, RequestOptions.DEFAULT);
    }
}