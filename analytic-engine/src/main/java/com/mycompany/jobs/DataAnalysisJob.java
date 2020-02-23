package com.mycompany.jobs;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import com.mycompany.models.PlotModel;
import org.apache.spark.api.java.JavaRDD;
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

import org.apache.spark.ml.clustering.KMeans;
import org.apache.spark.ml.clustering.KMeansModel;
import org.apache.spark.ml.linalg.Vector;
import org.apache.spark.ml.evaluation.ClusteringEvaluator;

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

        // ------------------ LOAD RESOURCES AND CLEAN DATA ------------------
        JobModel job = mongodbRepository.getJobById(jobId);
        List<PlotModel> plots = mongodbRepository.loadPlots(jobId);
        List<AggregationModel> aggregations = mongodbRepository.loadAggregations(jobId);
        //Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), job.rawInputDirectory));
        Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), "pp-2018-part1 lite.csv"));


        // ------------------ PERFORM PLOTS & SAVE RESULTS ------------------
        for (PlotModel plotModel : plots) {
            Dataset<Row> plorReadyDataset = plotSelect(dataset, plotModel);
            long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);

            // Save to staging
            saveToStaging(plorReadyDataset, String.format("/%s/%s/staging/%d/%s",
                    userId, jobId, dateEpoch, plotModel._id));
            // Save to elasticsearch
            if (configModel.elasticsearchUrl() != null && job.generateESIndices) {
                saveToES(plorReadyDataset, plotModel._id, restHighLevelClient, dateEpoch);
            }
        }

        // ------------------ PERFORM GROUPBYS & SAVE RESULTS ------------------
        // Iterate through the defined aggregations and perform their gorupby
        for (AggregationModel agg : aggregations) {
            Dataset<Row> groupByDataset = groupBy(dataset, agg).cache();
            long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);
            saveToStaging(groupByDataset, String.format("/%s/%s/staging/%d/%s",
                    userId, jobId, dateEpoch, agg._id));
            if (configModel.elasticsearchUrl() != null && job.generateESIndices) {
                saveToES(groupByDataset, agg._id, restHighLevelClient, dateEpoch);
            }
        }

//        // ------------------ PERFORM CLUSTERING & SAVE RESULTS ------------------
//        // Must convert the selected columns into a LibSVMDataSource object before ML can be done
//        // Use the bookmarked resource to convert a record of 2 numeric columns to a 2 vectors of 2 numeric columns and the label one with just 1.
//        // For each the dataset and build this other dataset or apply a .format to it somehow.
//        // The run the OG clustering algorithm on it.
//        Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), "zikaVirusReportedCases-lite.csv"));
//        dataset = HelperFunctions.getValidDataset(dataset).cache();
//
//        dataset.show();
//
//        JavaRDD<Row> javaRDDDataset = dataset.toJavaRDD().cache();
//
//        javaRDDDataset.foreach(data -> {
//            System.out.println(data);
//        });

        // ------------------ CLEANUP ENVIRONMENT ------------------
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

    private Dataset<Row> plotSelect(Dataset<Row> dataset, PlotModel plotModel) {
        Dataset<Row> selectedDataset;

        if (plotModel.identifier.equals(plotModel.xAxis) || plotModel.identifier.equals(plotModel.yAxis)){
            selectedDataset = dataset.select(plotModel.xAxis, plotModel.yAxis).cache();
        } else {
            selectedDataset = dataset.select(plotModel.identifier, plotModel.xAxis, plotModel.yAxis).cache();
        }

        return selectedDataset;
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
        //dataset.write().mode(SaveMode.Overwrite).format(ext).save(fullFilename);
    }

    /**
     *
     * @param dataset
     * @param entityId
     * @param hlClient
     * @param dateEpoch
     * @throws IOException
     */
    private void saveToES(Dataset<Row> dataset, String entityId, RestHighLevelClient hlClient, long dateEpoch) throws IOException {
        String alias = getElasticIndexNamePrefix(entityId);
        String indexName = getElasticIndexName(entityId, dateEpoch);
        List<String> indices = listIndices(getElasticIndexNamePrefix(entityId));

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
