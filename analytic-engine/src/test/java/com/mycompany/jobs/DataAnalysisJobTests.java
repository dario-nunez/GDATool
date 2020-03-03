package com.mycompany.jobs;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.*;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import org.apache.commons.io.FileUtils;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.elasticsearch.client.RestHighLevelClient;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.Assert.assertEquals;

/**
 * This file tests the DataAnalysis job support methods (all public methods found in the class except the run method).
 */
public class DataAnalysisJobTests {
    private Dataset<Row> inputDataset;
    private DataAnalysisJob dataAnalysisJob;
    private ConfigModel configModel;
    private ObjectMapper objectMapper;
    private ClassLoader classLoader;

    @Mock
    MongodbRepository mongodbRepositoryMock;
    @Mock
    ElasticsearchRepository elasticsearchRepositoryMock;
    @Mock
    RestHighLevelClient restHighLevelClientMock;

    /**
     * Initialize the test class, set up the environment, create mock objects and read an input dataset.
     * @throws IOException
     */
    public DataAnalysisJobTests() throws IOException {
        this.objectMapper = new ObjectMapper();
        classLoader = getClass().getClassLoader();
        MockitoAnnotations.initMocks(this);
        DependencyFactory dependencyFactory = new TestDependencyFactory();
        configModel = dependencyFactory.getConfigModel();
        SparkSession sparkSession = dependencyFactory.getSparkSession();
        dataAnalysisJob = new DataAnalysisJob(sparkSession, configModel, mongodbRepositoryMock,
                elasticsearchRepositoryMock, restHighLevelClientMock);
        inputDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDS.csv"));
    }

    /**
     * Should return the original dataset but with only the city and price columns.
     * @throws IOException
     */
    @Test
    public void plotSelect_populatedDataset_returnDatasetWithOnlyTheSpecifiedColumns() throws IOException {
        File plotsFile = new File(Objects.requireNonNull(classLoader.getResource("testPlots.json")).getFile());
        String plotsFileContents = FileUtils.readFileToString(plotsFile, StandardCharsets.UTF_8);
        List<PlotModel> plots = objectMapper.readValue(plotsFileContents, new TypeReference<List<PlotModel>>(){});
        PlotModel plotModel = plots.get(0);

        Dataset<Row> actualDataset = dataAnalysisJob.plotSelect(inputDataset, plotModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSSelectedPlot.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return the original dataset but with only the city and price columns.
     * @throws IOException
     */
    @Test
    public void plotSelect_emptyDataset_returnEmptyDatasetWithOnlyTheSpecifiedColumns() throws IOException {
        File plotsFile = new File(Objects.requireNonNull(classLoader.getResource("testPlots.json")).getFile());
        String plotsFileContents = FileUtils.readFileToString(plotsFile, StandardCharsets.UTF_8);
        List<PlotModel> plots = objectMapper.readValue(plotsFileContents, new TypeReference<List<PlotModel>>(){});
        PlotModel plotModel = plots.get(0);

        Dataset<Row> emptyDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmpty.csv"));
        Dataset<Row> actualDataset = dataAnalysisJob.plotSelect(emptyDataset, plotModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmptyPlotSelected.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return the original dataset but with the given filter applied.
     * @throws IOException
     */
    @Test
    public void filter_populatedDataset_returnDatasetWithAppliedFilter() throws IOException {
        File filterFile = new File(Objects.requireNonNull(classLoader.getResource("testFilters.json")).getFile());
        String filterFileContents = FileUtils.readFileToString(filterFile, StandardCharsets.UTF_8);
        List<FilterModel> filters = objectMapper.readValue(filterFileContents, new TypeReference<List<FilterModel>>(){});

        Dataset<Row> actualDataset = dataAnalysisJob.filter(inputDataset, filters).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSFiltered.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return the original dataset but with the given filter applied.
     * @throws IOException
     */
    @Test
    public void filter_emptyDataset_returnEmptyDataset() throws IOException {
        File filterFile = new File(Objects.requireNonNull(classLoader.getResource("testFilters.json")).getFile());
        String filterFileContents = FileUtils.readFileToString(filterFile, StandardCharsets.UTF_8);
        List<FilterModel> filters = objectMapper.readValue(filterFileContents, new TypeReference<List<FilterModel>>(){});

        Dataset<Row> emptyDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmpty.csv"));
        Dataset<Row> actualDataset = dataAnalysisJob.filter(emptyDataset, filters).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmpty.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }


    /**
     * Should return an empty dataset, but it should be grouped by the metadata in the AggregationModel.
     * @throws IOException
     */
    @Test
    public void groupBy_emptyDataset_returnEmptyGroupedByDataset() throws IOException {
        File aggregationFile = new File(Objects.requireNonNull(classLoader.getResource("testAggregations.json")).getFile());
        String aggregationFileContents = FileUtils.readFileToString(aggregationFile, StandardCharsets.UTF_8);
        List<AggregationModel> aggregations = objectMapper.readValue(aggregationFileContents, new TypeReference<List<AggregationModel>>(){});
        AggregationModel aggregationModel = aggregations.get(0);

        Dataset<Row> emptyDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmpty.csv"));
        Dataset<Row> actualDataset = dataAnalysisJob.groupBy(emptyDataset, aggregationModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmptyGroupedBy.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return a dataset grouped by the metadata in the AggregationModel.
     * @throws IOException
     */
    @Test
    public void groupBy_populatedDataset_returnGroupedByDataset() throws IOException {
        File aggregationFile = new File(Objects.requireNonNull(classLoader.getResource("testAggregations.json")).getFile());
        String aggregationFileContents = FileUtils.readFileToString(aggregationFile, StandardCharsets.UTF_8);
        List<AggregationModel> aggregations = objectMapper.readValue(aggregationFileContents, new TypeReference<List<AggregationModel>>(){});
        AggregationModel aggregationModel = aggregations.get(0);

        Dataset<Row> actualDataset = dataAnalysisJob.groupBy(inputDataset, aggregationModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSAppliedGroupBy.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return the original dataset but without outliers (records that are more than 1 SD) away from the mean of
     * their column.
     * @throws IOException
     */
    @Test
    public void removeOutliers_populatedDataset_returnDatasetWithoutOutliers() throws IOException {
        Dataset<Row> groupedByDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSExtendedGroupBy.csv"));
        File clusterFile = new File(Objects.requireNonNull(classLoader.getResource("testClusters.json")).getFile());
        String clusterFileContents = FileUtils.readFileToString(clusterFile, StandardCharsets.UTF_8);
        List<ClusterModel> clusters = objectMapper.readValue(clusterFileContents, new TypeReference<List<ClusterModel>>(){});
        ClusterModel clusterModel = clusters.get(0);

        List<String> featureColumns = new ArrayList<String>() {
            {
                add(clusterModel.xAxis);
                add(clusterModel.yAxis);
            }
        };

        Dataset<Row> actualDataset = dataAnalysisJob.removeOutliers(groupedByDataset, featureColumns).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSRemovedOutliers.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return an empty dataset.
     * @throws IOException
     */
    @Test
    public void removeOutliers_emptyDataset_returnEmptyDataset() throws IOException {
        Dataset<Row> emptyGroupedByDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmptyGroupedBy.csv"));
        File clusterFile = new File(Objects.requireNonNull(classLoader.getResource("testClusters.json")).getFile());
        String clusterFileContents = FileUtils.readFileToString(clusterFile, StandardCharsets.UTF_8);
        List<ClusterModel> clusters = objectMapper.readValue(clusterFileContents, new TypeReference<List<ClusterModel>>(){});
        ClusterModel clusterModel = clusters.get(0);

        List<String> featureColumns = new ArrayList<String>() {
            {
                add(clusterModel.xAxis);
                add(clusterModel.yAxis);
            }
        };

        Dataset<Row> actualDataset = dataAnalysisJob.removeOutliers(emptyGroupedByDataset, featureColumns).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmptyGroupedBy.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return the original dataset but with the extra column "cluster", containing a cluster value for each
     * record.
     * NOTE: {price,city,county} are considered different column names to {price, city, county}.
     * @throws IOException
     */
    @Test
    public void cluster_populatedDataset_returnDatasetWithAdditionalClusterColumn() throws IOException {
        Dataset<Row> groupedByDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSAppliedGroupBy.csv"));
        File clusterFile = new File(Objects.requireNonNull(classLoader.getResource("testClusters.json")).getFile());
        String clusterFileContents = FileUtils.readFileToString(clusterFile, StandardCharsets.UTF_8);
        List<ClusterModel> clusters = objectMapper.readValue(clusterFileContents, new TypeReference<List<ClusterModel>>(){});
        ClusterModel clusterModel = clusters.get(0);

        Dataset<Row> actualDataset = dataAnalysisJob.cluster(groupedByDataset, clusterModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSClustered.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return an empty dataset but with the extra column "cluster".
     * NOTE: {price,city,county} are considered different column names to {price, city, county}.
     * @throws IOException
     */
    @Test
    public void cluster_emptyDataset_returnEmptyDatasetWithAdditionalClusterColumn() throws IOException {
        Dataset<Row> emptyGroupedByDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSEmptyGroupedBy.csv"));
        File clusterFile = new File(Objects.requireNonNull(classLoader.getResource("testClusters.json")).getFile());
        String clusterFileContents = FileUtils.readFileToString(clusterFile, StandardCharsets.UTF_8);
        List<ClusterModel> clusters = objectMapper.readValue(clusterFileContents, new TypeReference<List<ClusterModel>>(){});
        ClusterModel clusterModel = clusters.get(0);

        Dataset<Row> actualDataset = dataAnalysisJob.cluster(emptyGroupedByDataset, clusterModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/dataAnalysisJobDSClusteredEmpty.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }
}
