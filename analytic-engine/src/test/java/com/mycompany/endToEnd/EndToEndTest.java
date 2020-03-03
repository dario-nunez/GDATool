package com.mycompany.endToEnd;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.jobs.DataAnalysisJob;
import com.mycompany.models.ConfigModel;
import com.mycompany.services.HttpService;
import org.apache.commons.io.FileUtils;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.client.indices.GetIndexResponse;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import static org.junit.Assert.assertTrue;

/**
 * This test requires the Elasticsearch-service and the Mongodb-service to be running
 */
@Ignore
public class EndToEndTest {
    private DependencyFactory dependencyFactory;
    private ConfigModel configModel;
    private ObjectMapper objectMapper;
    private ClassLoader classLoader;
    private HttpService httpService;
    private RestHighLevelClient restHighLevelClient;

    public EndToEndTest() throws IOException {
        this.objectMapper = new ObjectMapper();
        classLoader = getClass().getClassLoader();
        dependencyFactory = new TestDependencyFactory();
        configModel = dependencyFactory.getConfigModel();
        httpService = new HttpService();
        restHighLevelClient = dependencyFactory.getRestHighLevelClient();
    }

    @Before
    public void setup() throws IOException, UnirestException {
        tearDown();

        createTestRecord("testUsers.json", "user", false);
        createTestRecord("testJobs.json", "job/noAws", false);
        createTestRecord("testAggregations.json", "aggregation", true);
        createTestRecord("testPlots.json", "plot", true);
        createTestRecord("testClusters.json", "cluster", true);
        createTestRecord("testFilters.json", "filter", true);
    }

    @After
    public void tearDown() throws IOException, UnirestException {
        deleteTestRecordRecursively("user", "111111111111111111111111");
        deleteFolder("111111111111111111111111/222222222222222222222222/staging");

        if (elasticsearchIndexExists("444444444444444444444444")) {
            deleteElasticsearchIndex("444444444444444444444444");
        }

        if (elasticsearchIndexExists("333333333333333333333333")) {
            deleteElasticsearchIndex("333333333333333333333333");
        }

        if (elasticsearchIndexExists("112211221122112211221122")) {
            deleteElasticsearchIndex("112211221122112211221122");
        }

        if (elasticsearchIndexExists("555555555555555555555555")) {
            deleteElasticsearchIndex("555555555555555555555555");
        }

        if (elasticsearchIndexExists("666666666666666666666666")) {
            deleteElasticsearchIndex("666666666666666666666666");
        }

        if (elasticsearchIndexExists("113311331133113311331133")) {
            deleteElasticsearchIndex("113311331133113311331133");
        }

        if (elasticsearchIndexExists("999999999999999999999999")) {
            deleteElasticsearchIndex("999999999999999999999999");
        }

        // Index Patterns
        deleteKibanaEntity("index-pattern", "444444444444444444444444");
        deleteKibanaEntity("index-pattern", "333333333333333333333333");

        // Markups
        deleteKibanaEntity("visualization", "222222222222222222222222_markdown");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333_markdown");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444_markdown");

        // Plots
        deleteKibanaEntity("visualization", "666666666666666666666666_plot");
        deleteKibanaEntity("visualization", "555555555555555555555555_plot");
        deleteKibanaEntity("visualization", "222222222222222222222222_markdown");
        deleteKibanaEntity("visualization", "222222222222222222222222_markdown");

        // Metrics
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333count_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333sum_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333max_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333min_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333avg_metric");

        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444count_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444sum_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444max_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444min_metric");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444avg_metric");

        // Bar charts
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333_count_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333_sum_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333_max_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333_min_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333_avg_bar");

        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444_count_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444_sum_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444_max_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444_min_bar");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444_avg_bar");

        // Tables
        deleteKibanaEntity("visualization", "222222222222222222222222_333333333333333333333333_table");
        deleteKibanaEntity("visualization", "222222222222222222222222_444444444444444444444444_table");

        // Clusters
        deleteKibanaEntity("visualization", "444444444444444444444444_113311331133113311331133_cluster");
        deleteKibanaEntity("visualization", "333333333333333333333333_112211221122112211221122_cluster");
        deleteKibanaEntity("visualization", "333333333333333333333333_999999999999999999999999_cluster");

        // Dashboard
        deleteKibanaEntity("dashboard", "222222222222222222222222_dashboard");
    }

    @Test
    public void endToEndSimpleDashboardTest() throws IOException, UnirestException {
        DataAnalysisJob dataAnalysisJob = new DataAnalysisJob(dependencyFactory.getSparkSession(),
                dependencyFactory.getConfigModel(), dependencyFactory.getMongodbRepository(),
                dependencyFactory.getElasticsearchRepository(),
                dependencyFactory.getRestHighLevelClient());

        dataAnalysisJob.run("111111111111111111111111", "222222222222222222222222");

        // Indexes
        assertTrue(elasticsearchIndexExistsOnce("112211221122112211221122"));
        assertTrue(elasticsearchIndexExistsOnce("555555555555555555555555"));
        assertTrue(elasticsearchIndexExistsOnce("113311331133113311331133"));
        assertTrue(elasticsearchIndexExistsOnce("333333333333333333333333"));
        assertTrue(elasticsearchIndexExistsOnce("444444444444444444444444"));
        assertTrue(elasticsearchIndexExistsOnce("999999999999999999999999"));
        assertTrue(elasticsearchIndexExistsOnce("666666666666666666666666"));

        // Markups
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_markdown"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_markdown"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_markdown"));

        // Plots
        assertTrue(kibanaEntityExists("visualization", "666666666666666666666666_plot"));
        assertTrue(kibanaEntityExists("visualization", "555555555555555555555555_plot"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_markdown"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_markdown"));

        // Metrics
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333count_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333sum_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333max_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333min_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333avg_metric"));

        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444count_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444sum_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444max_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444min_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444avg_metric"));

        // Bar charts
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_count_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_sum_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_max_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_min_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_avg_bar"));

        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_count_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_sum_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_max_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_min_bar"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_avg_bar"));

        // Tables
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_table"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_table"));

        // Clusters
        assertTrue(kibanaEntityExists("visualization", "444444444444444444444444_113311331133113311331133_cluster"));
        assertTrue(kibanaEntityExists("visualization", "333333333333333333333333_112211221122112211221122_cluster"));
        assertTrue(kibanaEntityExists("visualization", "333333333333333333333333_999999999999999999999999_cluster"));

        // Dashboard
        assertTrue(kibanaEntityExists("dashboard", "222222222222222222222222_dashboard"));

        // Index Patterns
        assertTrue(kibanaEntityExists("index-pattern", "444444444444444444444444"));
        assertTrue(kibanaEntityExists("index-pattern", "333333333333333333333333"));
    }

    private void deleteFolder(String folderName) throws IOException {
        File f = new File(String.format("%s/%s/", configModel.stagingFolder(), folderName));
        FileUtils.deleteDirectory(f);
    }

    private void createTestRecord(String fileName, String url, boolean multiple) throws IOException, UnirestException {
        File entityFile = new File(Objects.requireNonNull(classLoader.getResource(fileName)).getFile());
        String entityFileContents = FileUtils.readFileToString(entityFile, StandardCharsets.UTF_8);

        Map<String, String> newDefaultHeaders = new HashMap<String, String>() {{
            put("Content-Type", "application/json");
            put("cache-control", "no-cache");
        }};

        if (multiple) {
            httpService.post(configModel.mongodbServiceUrl() + url + "/multiple", newDefaultHeaders, entityFileContents);
        } else {
            httpService.post(configModel.mongodbServiceUrl() + url, newDefaultHeaders, entityFileContents);
        }
    }

    private void deleteTestRecordRecursively(String url, String id) throws UnirestException {
        Map<String, String> newDefaultHeaders = new HashMap<String, String>() {{
            put("Content-Type", "application/json");
            put("cache-control", "no-cache");
        }};

        httpService.delete(configModel.mongodbServiceUrl() + url + "/recursive/" + id, newDefaultHeaders);
    }

    private boolean elasticsearchIndexExistsOnce(String indexId) throws IOException {
        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId + "*");
        GetIndexResponse getIndexResponse = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);
        return getIndexResponse.getIndices().length == 1;
    }

    private boolean elasticsearchIndexExists(String indexId) throws IOException {
        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId);
        return restHighLevelClient.indices().exists(getIndexRequest, RequestOptions.DEFAULT);
    }

    private boolean kibanaEntityExists(String superType, String id) throws IOException {
        String entityId = String.format("%s:%s", superType, id);
        GetRequest getRequest = new GetRequest(".kibana", entityId);
        return restHighLevelClient.exists(getRequest, RequestOptions.DEFAULT);
    }

    private void deleteKibanaEntity(String entitySuperType, String id) throws IOException {
        String entityId = String.format("%s:%s", entitySuperType, id);
        DeleteRequest deleteRequest = new DeleteRequest(".kibana", entityId);
        restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
    }

    private void deleteElasticsearchIndex(String indexId) throws IOException {
        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId + "*");
        GetIndexResponse getIndexResponse = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);

        String indexToDeleteId = getIndexResponse.getIndices()[0];

        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest(indexToDeleteId);
        restHighLevelClient.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
    }
}
