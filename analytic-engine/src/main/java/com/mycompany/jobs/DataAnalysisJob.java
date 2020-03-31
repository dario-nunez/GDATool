package com.mycompany.jobs;

import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import com.mycompany.models.*;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.mllib.clustering.KMeansModel;
import org.apache.spark.sql.*;
import org.apache.spark.sql.types.DataTypes;;
import org.elasticsearch.action.admin.indices.alias.IndicesAliasesRequest;
import org.elasticsearch.action.admin.indices.alias.get.GetAliasesRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.get.GetIndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.spark.sql.api.java.JavaEsSparkSQL;
import org.slf4j.LoggerFactory;
import scala.collection.Seq;

import org.apache.spark.mllib.clustering.KMeans;
import org.apache.spark.mllib.linalg.Vector;
import org.apache.spark.mllib.linalg.Vectors;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

/**
 * The Data Analysis job is able to perform a range of analytic sub-jobs on a dataset. An input JobModel specified
 * which dataset to use and which sub-jobs to run on it. Every dataset, regardless of their JobModel is cleaned at the
 * start of the job. The available sub-jobs are the following:
 *
 * - Plots: Depend on PlotModels linked to the JobModel and allow the user to build their own indexes to be visualized by
 * Scatted Plots in Kibana.
 * - Filters: Depend on FilterModels linked to AggregationModels linked to the JobModel and allow the user to filter their
 * dataset before group bys and clustering are performed.
 * - GroupBys: Depend on AggregationModels linked the JobModel and allow the user to produce aggregation indexes that will
 * be used by Kibana to build various visualizations.
 * - Clusters: Depend on ClusterModels linked to AggregationModels linked to the JobModel and allow the user to create
 * indexes of their clustered grouped by datasets that are then used by Kibana to show clustered Scatter Plot charts.
 *
 * The results of the Data Analysis job are stored in two places: the staging folder of the user S3 bucket and the
 * Elasticsearch cluster.
 */
public class DataAnalysisJob extends Job {
    private RestHighLevelClient restHighLevelClient;

    public DataAnalysisJob(SparkSession sparkSession, ConfigModel configModel,
                           MongodbRepository mongodbRepository, ElasticsearchRepository elasticsearchRepository,
                           RestHighLevelClient restHighLevelClient) {
        super(sparkSession, configModel, mongodbRepository, elasticsearchRepository);
        this.restHighLevelClient = restHighLevelClient;
        logger = LoggerFactory.getLogger(DataAnalysisJob.class);
    }

    /**
     * Run the Data Analysis job. Read all Mongodb entities linked to a job and the job's dataset. Perform Cleaning,
     * Plotting, Filtering, Aggregations and Clustering on the dataset. Generate parquet files to be stored in the
     * staging AWS directory and Elasticsearch indexes to be stored in Elasticsearch. Generate Kibana dashboard to make
     * use of the Elasticsearch indexes in visualizing the data.
     * @param userId: owner of the job.
     * @param jobId: the job being executed.
     * @throws IOException
     * @throws UnirestException
     */
    @Override
    public void run(String userId, String jobId) throws IOException, UnirestException {
        logger.info("job {} by user {} is starting", jobId, userId);

        // Read: Get Mongodb entities and dataset from AWS.
        JobModel job = mongodbRepository.getJobById(jobId);
        List<PlotModel> plots = mongodbRepository.loadPlots(jobId);
        List<AggregationModel> aggregations = mongodbRepository.loadAggregations(jobId);
        Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), job.rawInputDirectory));
//        Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), "uk-properties-large.csv"));

        // Clean: Clean the dataset.
        dataset = HelperFunctions.getValidDataset(dataset);
        dataset = HelperFunctions.simplifyTypes(dataset);

        // Plot: Generate plotted datasets and store them in AWS and Elasticsearch.
        for (PlotModel plotModel : plots) {
            Dataset<Row> plotedDataset = plotSelect(dataset, plotModel);
            long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);

            // Save to staging.
            saveToStaging(plotedDataset, String.format("/%s/%s/staging/%d/%s",
                    userId, jobId, dateEpoch, plotModel._id));

            // Save to Elasticsearch.
            if (configModel.elasticsearchUrl() != null && job.generateESIndices) {
                saveToES(plotedDataset, plotModel._id, restHighLevelClient, dateEpoch);
            }
        }

        // Aggregate: Generate filtered, grouped by and clustered datasets. Store these in AWS and Elasticsearch.
        for (AggregationModel agg : aggregations) {
            // Filter.
            List<FilterModel> filters = mongodbRepository.loadFilters(agg._id);
            Dataset<Row> filteredDataset = filter(dataset, filters).cache();

            // GroupBy.
            Dataset<Row> groupByDataset = groupBy(filteredDataset, agg).cache();

            // Save to staging.
            long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);
            saveToStaging(groupByDataset, String.format("/%s/%s/staging/%d/%s",
                    userId, jobId, dateEpoch, agg._id));

            // Save to Elasticsearch.
            if (configModel.elasticsearchUrl() != null && job.generateESIndices) {
                saveToES(groupByDataset, agg._id, restHighLevelClient, dateEpoch);
            }

            // Cluster.
            List<ClusterModel> clusters = mongodbRepository.loadClusters(agg._id);
            for (ClusterModel cluster : clusters) {
                Dataset<Row> clusteredDataset = cluster(groupByDataset, cluster);

                // Save to staging.
                dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);
                saveToStaging(clusteredDataset, String.format("/%s/%s/staging/%d/%s",
                        userId, jobId, dateEpoch, cluster._id));

                // Save to Elasticsearch.
                if (configModel.elasticsearchUrl() != null && job.generateESIndices) {
                    saveToES(clusteredDataset, cluster._id, restHighLevelClient, dateEpoch);
                }
            }
        }

        // Cleanup: Finish the job and cleanup the environment by generating dashboards, closing clients and marking
        // the processed job as complete.
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
     * Perform group bys on a dataset. The feature, metric & operation columns are transformed into a Spark friendly
     * format, the group by is performed and the correctly typed dataset is returned.
     * @param dataset: the dataset to perform the group bys on.
     * @param aggregationModel: the AggregationModel object containing the metadata necessary to perform group bys.
     * @return a grouped by dataset.
     */
    public Dataset<Row> groupBy(Dataset<Row> dataset, AggregationModel aggregationModel) {
        // Collect feature columns into an list of Column.
        List<Column> catColumns = aggregationModel.featureColumns.stream().map(functions::col).collect(Collectors.toList());

        // Collect operation columns into a list of String.
        List<String> operations = aggregationModel.operations.stream().map(operation -> operation.toString().toLowerCase()).collect(Collectors.toList());

        // Collect the metric column into a Column object.
        Column metricColumn = col(aggregationModel.metricColumn);

        logger.info("Grouping by {}", catColumns.stream().map(Column::logName).collect(Collectors.joining(",")));

        // Join the feature and metric columns (the columns the dataset with be selected by).
        List<Column> selectColumnsList = new ArrayList<>(catColumns);
        selectColumnsList.add(metricColumn);

        // Convert the feature column list to an array of Columns.
        Column[] categoriesColumns = new Column[catColumns.size()];
        for (int i = 0; i < categoriesColumns.length; i++) {
            categoriesColumns[i] = catColumns.get(i);
        }

        // Convert the list of selected columns in an array of Column.
        Column[] selectColumns = new Column[selectColumnsList.size()];
        for (int i = 0; i < selectColumnsList.size(); i++) {
            selectColumns[i] = selectColumnsList.get(i);
        }

        // Create a list of Columns containing each operation defined in the AggregationModel.
        List<Column> operationColumns = getOperationColumns(aggregationModel);

        // Convert the list of operation Columns to a Scala sequence of Columns.
        Seq<Column> aggregationColumns = scala.collection.JavaConversions.asScalaBuffer(operationColumns.subList(1, operationColumns.size()));

        // Ensure feature columns are of type String.
        dataset = HelperFunctions.stringifyFeatureColumns(dataset, aggregationModel.featureColumns).cache();

        // Create a new dataset containing only the feature columns and a column for each operation over
        // the metric column.
        Dataset<Row> returnDataset = dataset.select(selectColumns)
                .groupBy(categoriesColumns)
                .agg(operationColumns.get(0), aggregationColumns)
                .sort(desc(aggregationModel.sortColumnName))
                .cache();

        // Ensure the operation columns are typed as Doubles
        for (String operation : operations) {
            returnDataset = returnDataset.withColumn(operation, col(operation).cast(DataTypes.DoubleType)).cache();
        }

        return returnDataset;
    }

    /**
     * Remove outliers from a dataset by taking 1 Standard Deviation from the mean of each column.
     * @param dataset: the dataset to remove outliers from.
     * @param featureColumns: the list of columns by which to remove outliers from the dataset.
     * @return a dataset object where no value in any feature column is more than 1 SD from the mean of that column.
     */
    public Dataset<Row> removeOutliers(Dataset<Row> dataset, List<String> featureColumns) {
        // Return an empty dataset if the input dataset contains no data records
        if (dataset.isEmpty()) {
            return dataset;
        }

        // For each feature column, calculate its mean & standard deviation, calculate an upper & lower bound and then
        // filter the column by those values.
        for (String column : featureColumns) {
            Double mean = (Double) dataset.agg(mean(col(column))).cache().first().get(0);
            Double std = (Double) dataset.agg(stddev(col(column))).cache().first().get(0);
            if (std.isNaN()) {
                std = 0.0;
            }
            double upperBound = mean + std;
            double lowerBound = mean - std;

            dataset.registerTempTable("table");
            dataset = sparkSession.sqlContext().sql("SELECT * FROM table WHERE "+ column +" <= "+ upperBound +" AND "+ column +" >= " + lowerBound).cache();
        }

        return dataset;
    }

    /**
     * Perform clustering on a dataset given a ClusterModel. The dataset is rid of outliers and transformed for the
     * clustering process. Multiple K-means cluster model instances are created to find an optimal value of K. That
     * value is then used to cluster the dataset, which is then returned.
     * @param dataset: the dataset to cluster.
     * @param clusterModel: the ClusterModel containing the information necessary to perform the clustering.
     * @return the input dataset with an additional "cluster" column.
     */
    public Dataset<Row> cluster(Dataset<Row> dataset, ClusterModel clusterModel) {
        // Return an empty dataset if the input dataset contains no data records
        if (dataset.isEmpty()) {
            return dataset.withColumn("cluster", lit(0)).cache();
        }

        // Select columns necessary for clustering.
        List<String> featureColumns = new ArrayList<>();
        featureColumns.add(clusterModel.xAxis.toLowerCase());
        featureColumns.add(clusterModel.yAxis.toLowerCase());

        // Remove outliers by taking 1 SD.
        dataset = removeOutliers(dataset, featureColumns).cache();

        // Prepares data for clustering by converting it to JavaRDD objects.
        List<Column> clusterColumns = featureColumns.stream().map(functions::col).collect(Collectors.toList());
        Seq<Column> seqClusterColumns = scala.collection.JavaConversions.asScalaBuffer(clusterColumns.subList(0, clusterColumns.size()));
        Dataset<Row> datasetForClustering = dataset.select(seqClusterColumns).cache();

        JavaRDD<Row> javaRDDDataset = datasetForClustering.toJavaRDD().cache();
        JavaRDD<Vector> parsedData = javaRDDDataset.map(s -> {
            String stringRow = s.toString().substring(1, s.toString().length()-1);
            String[] arrayRow = stringRow.split(",");
            double[] values = new double[arrayRow.length];
            for (int i = 0; i < arrayRow.length; i++) {
                values[i] = Double.parseDouble(arrayRow[i]);
            }
            return Vectors.dense(values);
        });
        parsedData.cache();

        // Probe K-means to find a local optimum K value by training models with multiple values of K and evaluating
        // their score results.
        int bestK = 1;
        double bestKScore = 0;
        int numIterations = 20;
        KMeansModel kMeansModelProbe;

        for (int i = 2; i < 6; i++) {
            kMeansModelProbe = KMeans.train(parsedData.rdd(), i, numIterations);
            double score = kMeansModelProbe.computeCost(parsedData.rdd());
            if (score > bestKScore) {
                bestK = i;
                bestKScore = score;
            }
        }

        // Uses optimal K value to perform optimal K-means clustering.
        KMeansModel kMeansModel = KMeans.train(parsedData.rdd(), bestK, numIterations);

        // Ensure columns necessary for clustering are casted to doubles.
        for (String column:featureColumns) {
            dataset = dataset.withColumn(column, col(column).cast(DataTypes.DoubleType)).cache();
        }

        // Define a Spark function that assigns cluster values to each record given then trained KMeansModel.
        sparkSession.sqlContext().udf().register("assignCluster", (Double a, Double b) -> {
            double[] features = {a, b};
            return (double) kMeansModel.predict(Vectors.dense(features));
        }, DataTypes.DoubleType);

        // Use the K-means model to predict the cluster of each record. Store this result in the dataset and return it.
        dataset.registerTempTable("temp");
        return sparkSession.sqlContext().sql("SELECT *, assignCluster(" + featureColumns.get(0) + ", " + featureColumns.get(1) + ") AS `cluster` FROM temp").cache();
    }

    /**
     * Filter a dataset given a list of FilterModel. For each FilterModel, perform its query on the dataset.
     * @param dataset: the dataset to be filtered.
     * @param filters: the list of FilterModels containing filtering information.
     * @return a dataset that has had all input filters applied.
     */
    public Dataset<Row> filter(Dataset<Row> dataset, List<FilterModel> filters) {
        if (filters.size() < 1) {
            return dataset;
        }

        StringBuilder sqlQuery = new StringBuilder("SELECT * FROM source WHERE ");

        for (FilterModel filterModel : filters) {
            sqlQuery.append(filterModel.query).append(" AND ");
        }

        sqlQuery = new StringBuilder(sqlQuery.substring(0, sqlQuery.length() - 5));

        Dataset<Row> filteredDataset = dataset;
        filteredDataset.createOrReplaceTempView("source");
        filteredDataset = sparkSession.sql(sqlQuery.toString());

        return filteredDataset;
    }

    /**
     * Reduce a dataset given a PlotModel. Parse the information in the PlotModel and produce the smallest possible
     * dataset that satisfies the criteria.
     * @param dataset: the dataset to be plot selected.
     * @param plotModel: the PlotModel containing the selection information.
     * @return a dataset that has been reduced by a plot select operation.
     */
    public Dataset<Row> plotSelect(Dataset<Row> dataset, PlotModel plotModel) {
        Dataset<Row> selectedDataset;

        // Include either 2 or 3 selected columns in the output dataset.
        if (plotModel.identifier.equals(plotModel.xAxis) || plotModel.identifier.equals(plotModel.yAxis)){
            selectedDataset = dataset.select(plotModel.xAxis, plotModel.yAxis).cache();
        } else {
            selectedDataset = dataset.select(plotModel.identifier, plotModel.xAxis, plotModel.yAxis).cache();
        }

        return selectedDataset;
    }

    /**
     * Saves a dataset to a staging folder in parquet format.
     * @param dataset: the dataset to be saved.
     * @param filename: the relative path where the parquet files should be stored.
     */
    private void saveToStaging(Dataset<Row> dataset, String filename) {
        String ext = "parquet";
        String fullFilename = configModel.stagingFolder() + filename + "." + ext;
        logger.info("Writing to {}", fullFilename);
        dataset.write().mode(SaveMode.Overwrite).format(ext).save(fullFilename);
    }

    /**
     * Save a dataset to Elasticsearch and upkeep the indexes. Ensure that at all times, at most 2 indexes of the same
     * alias exist, and that this alias is always pointing to the latest one. This is done to create a backup of all
     * datasets in Elasticsearch, opening up options for recovery.
     * @param dataset: the dataset to be saved to ES.
     * @param entityId: the ID of the index the dataset will be saved in.
     * @param hlClient: the client used to interface with the Elasticsearch cluster.
     * @param dateEpoch: the current timestamp.
     * @throws IOException
     */
    private void saveToES(Dataset<Row> dataset, String entityId, RestHighLevelClient hlClient, long dateEpoch) throws IOException {
        String alias = getElasticIndexNamePrefix(entityId);
        String indexName = getElasticIndexName(entityId, dateEpoch);
        List<String> indices = listIndices(getElasticIndexNamePrefix(entityId));

        // Delete alias
        if (indices.size() > 0) {
            deleteAlias(alias, indices.get(indices.size() - 1));
        }

        // Delete the oldest index
        if (indices.size() > 1) {
            String oldIndex = indices.get(indices.size() - 2);
            DeleteIndexRequest request = new DeleteIndexRequest(oldIndex);
            logger.info("Deleting index {}", oldIndex);
            hlClient.indices().delete(request, RequestOptions.DEFAULT);
        }

        // Save to ES
        GetIndexRequest getIndexRequest = new GetIndexRequest();
        getIndexRequest.indices(indexName);
        logger.info("Creating index {}", indexName);
        JavaEsSparkSQL.saveToEs(dataset, indexName + "/docs");

        // Add new alias
        addAlias(alias, indexName);
    }

    /**
     * Get all indices currently stored in the Elasticsearch cluster under an alias.
     * @param prefix: the alias of the indices being queried for.
     * @return a list of all indices that have that alias as a prefix.
     * @throws IOException
     */
    private List<String> listIndices(String prefix) throws IOException {
        org.elasticsearch.client.indices.GetIndexRequest getIndexRequest = new org.elasticsearch.client.indices.GetIndexRequest("*");
        org.elasticsearch.client.indices.GetIndexResponse getIndexResponse = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);
        return Arrays.asList(getIndexResponse.getIndices()).stream().filter(index -> index.startsWith(prefix)).sorted().collect(Collectors.toList());
    }

    /**
     * Delete an Elasticsearch alias from an index.
     * @param alias: the alias to be removed from index.
     * @param oldIndex: the index to have its alias removed.
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
     * Add an Elasticsearch alias to an index.
     * @param alias: the alias to be added.
     * @param newIndex: the index to have an alias added.
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
     * Check if an alias exists in the Elasticsearch cluster.
     * @param alias: alias to be checked for.
     * @return whether the alias exists or not.
     * @throws IOException
     */
    private boolean aliasExists(String alias) throws IOException {
        GetAliasesRequest request = new GetAliasesRequest();
        request.aliases(alias);
        return restHighLevelClient.indices().existsAlias(request, RequestOptions.DEFAULT);
    }

    /**
     * Update the job status of a job to indicate that a Data Analysis job has been successfully ran on it. The value
     * used for this being 5.
     * @param job: the job to be updated.
     * @throws IOException
     * @throws UnirestException
     */
    private void markJobAsComplete(JobModel job) throws IOException, UnirestException {
        job.jobStatus = 5;
        mongodbRepository.markJobAsComplete(job);
    }
}
