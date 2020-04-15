package com.mycompany.endToEnd;

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
 * This EndToEndTest tests that the DataAnalysis job creates the expected Elasticsearch entities given a collection of
 * Mongodb entries and a dataset.
 *
 * It requires the Elasticsearch-service and the Mongodb-service to run therefore it is ignored by default.
 */
@Ignore
public class EndToEndTest {
    private DependencyFactory dependencyFactory;
    private ConfigModel configModel;
    private ClassLoader classLoader;
    private HttpService httpService;
    private RestHighLevelClient restHighLevelClient;

    public EndToEndTest() throws IOException {
        classLoader = getClass().getClassLoader();
        dependencyFactory = new TestDependencyFactory();
        configModel = dependencyFactory.getConfigModel();
        httpService = new HttpService();
        restHighLevelClient = dependencyFactory.getRestHighLevelClient();
    }

    /**
     * Execute a teardown, then create all Mongodb testing entries.
     * @throws IOException
     * @throws UnirestException
     */
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

    /**
     * Delete test Mongodb entries, staging folder and Elasticsearch entries.
     * @throws IOException
     * @throws UnirestException
     */
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

    /**
     * Running the DataAnalysis job should create the expected Elasticsearch entities.
     * @throws IOException
     * @throws UnirestException
     */
    @Test
    public void dataAnalysisJobRun_createExpectedElasticsearchEntities() throws IOException, UnirestException {
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
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_count_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_sum_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_max_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_min_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_333333333333333333333333_avg_metric"));

        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_count_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_sum_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_max_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_min_metric"));
        assertTrue(kibanaEntityExists("visualization", "222222222222222222222222_444444444444444444444444_avg_metric"));

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

    /**
     * Delete a folder given its relative path to the root specified in the config model.
     * @param folderName: relative path of the directory
     * @throws IOException
     */
    private void deleteFolder(String folderName) throws IOException {
        File f = new File(String.format("%s/%s/", configModel.stagingFolder(), folderName));
        FileUtils.deleteDirectory(f);
    }

    /**
     * Send POST requests to Mongodb via the mongodb-service containing the data in a given file.
     * @param fileName: the file containing the Mongo entity to be saved.
     * @param url: the url of the entity type (User, Job, etc...).
     * @param multiple: whether the file contains a single entity or a list of entities.
     * @throws IOException
     * @throws UnirestException
     */
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

    /**
     * Send DELETE requests to Mongodb via the mongodb-service.
     * @param url: the url of the entity type (User, Job, etc...).
     * @param id: the ID of the entity to be deleted.
     * @throws UnirestException
     */
    private void deleteTestRecordRecursively(String url, String id) throws UnirestException {
        Map<String, String> newDefaultHeaders = new HashMap<String, String>() {{
            put("Content-Type", "application/json");
            put("cache-control", "no-cache");
        }};
        httpService.delete(configModel.mongodbServiceUrl() + url + "/recursive/" + id, newDefaultHeaders);
    }

    /**
     * Check if an index exists in the Elasticsearch cluster exactly once.
     * @param indexId: index to be checked for.
     * @return true if there is only one occurrence, false otherwise
     * @throws IOException
     */
    private boolean elasticsearchIndexExistsOnce(String indexId) throws IOException {
        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId + "*");
        GetIndexResponse getIndexResponse = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);
        return getIndexResponse.getIndices().length == 1;
    }

    /**
     * Check if an index exists in the Elasticsearch cluster.
     * @param indexId: index to be checked for.
     * @return true if the index is found, false otherwise.
     * @throws IOException
     */
    private boolean elasticsearchIndexExists(String indexId) throws IOException {
        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId);
        return restHighLevelClient.indices().exists(getIndexRequest, RequestOptions.DEFAULT);
    }

    /**
     * Check if an entity (JSON object) exists in the Elasticsearch cluster.
     * @param superType: the type of the entity (visualization, index-pattern, etc...)
     * @param id: the ID of the entity.
     * @return true if it is found, false otherwise.
     * @throws IOException
     */
    private boolean kibanaEntityExists(String superType, String id) throws IOException {
        String entityId = String.format("%s:%s", superType, id);
        GetRequest getRequest = new GetRequest(".kibana", entityId);
        return restHighLevelClient.exists(getRequest, RequestOptions.DEFAULT);
    }

    /**
     * Delete an entity in Elasticsearch.
     * @param entitySuperType: the type of the entity (visualization, index-pattern, etc...)
     * @param id: the ID of the entity.
     * @throws IOException
     */
    private void deleteKibanaEntity(String entitySuperType, String id) throws IOException {
        String entityId = String.format("%s:%s", entitySuperType, id);
        DeleteRequest deleteRequest = new DeleteRequest(".kibana", entityId);
        restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
    }

    /**
     * Delete an index in Elasticsearch.
     * @param indexId: index to be checked for.
     * @throws IOException
     */
    private void deleteElasticsearchIndex(String indexId) throws IOException {
        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId + "*");
        GetIndexResponse getIndexResponse = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);
        String indexToDeleteId = getIndexResponse.getIndices()[0];
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest(indexToDeleteId);
        restHighLevelClient.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
    }
}
