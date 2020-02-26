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
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.Assert.assertEquals;

public class DataAnalysisJobTests {
    private final String c = HelperFunctions.replaceCharacter;
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

    public DataAnalysisJobTests() throws IOException {
        this.objectMapper = new ObjectMapper();
        classLoader = getClass().getClassLoader();
        MockitoAnnotations.initMocks(this);
        DependencyFactory dependencyFactory = new TestDependencyFactory();
        configModel = dependencyFactory.getConfigModel();
        SparkSession sparkSession = dependencyFactory.getSparkSession();
        dataAnalysisJob = new DataAnalysisJob(sparkSession, configModel, mongodbRepositoryMock,
                elasticsearchRepositoryMock, restHighLevelClientMock);
        inputDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDS.csv"));
    }

    /**
     * city and price are selected
     */
    @Test
    public void plotSelect() throws IOException {
        File plotsFile = new File(Objects.requireNonNull(classLoader.getResource("testPlots.json")).getFile());
        String plotsFileContents = FileUtils.readFileToString(plotsFile, StandardCharsets.UTF_8);
        List<PlotModel> plots = objectMapper.readValue(plotsFileContents, new TypeReference<List<PlotModel>>(){});
        PlotModel plotModel = plots.get(0);

        Dataset<Row> actualDataset = dataAnalysisJob.plotSelect(inputDataset, plotModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDSSelectedPlot.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    @Test
    public void filter() throws IOException {
        File filterFile = new File(Objects.requireNonNull(classLoader.getResource("testFilters.json")).getFile());
        String filterFileContents = FileUtils.readFileToString(filterFile, StandardCharsets.UTF_8);
        List<FilterModel> filters = objectMapper.readValue(filterFileContents, new TypeReference<List<FilterModel>>(){});

        Dataset<Row> actualDataset = dataAnalysisJob.filter(inputDataset, filters).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDSFiltered.csv"));
        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    @Test
    public void groupBy() throws IOException {
        File aggregationFile = new File(Objects.requireNonNull(classLoader.getResource("testAggregations.json")).getFile());
        String aggregationFileContents = FileUtils.readFileToString(aggregationFile, StandardCharsets.UTF_8);
        List<AggregationModel> aggregations = objectMapper.readValue(aggregationFileContents, new TypeReference<List<AggregationModel>>(){});
        AggregationModel aggregationModel = aggregations.get(0);

        Dataset<Row> actualDataset = dataAnalysisJob.groupBy(inputDataset, aggregationModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDSAppliedGroupBy.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    @Test
    public void removeOutliers() throws IOException {
        Dataset<Row> groupedByDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDSExtendedGroupBy.csv"));
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
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDSRemovedOutliers.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * {price,city,county} will generate different column names as {price, city, county}
     * @throws IOException
     */
    @Test
    public void cluster() throws IOException {
        Dataset<Row> groupedByDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDSAppliedGroupBy.csv"));
        File clusterFile = new File(Objects.requireNonNull(classLoader.getResource("testClusters.json")).getFile());
        String clusterFileContents = FileUtils.readFileToString(clusterFile, StandardCharsets.UTF_8);
        List<ClusterModel> clusters = objectMapper.readValue(clusterFileContents, new TypeReference<List<ClusterModel>>(){});
        ClusterModel clusterModel = clusters.get(0);

        Dataset<Row> actualDataset = dataAnalysisJob.cluster(groupedByDataset, clusterModel).cache();
        Dataset<Row> expectedDataset = dataAnalysisJob.read(String.format("%s/%s", configModel.bucketRoot(), "dataAnalysisJobDSClustered.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }
}
