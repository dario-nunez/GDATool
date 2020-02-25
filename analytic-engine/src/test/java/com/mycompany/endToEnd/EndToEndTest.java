//package com.mycompany.endToEnd;
//
//import com.google.inject.Guice;
//import com.google.inject.Injector;
//import com.mashape.unirest.http.HttpResponse;
//import com.mashape.unirest.http.exceptions.UnirestException;
//import com.mycompany.TestModule;
//import com.mycompany.configuration.Log;
//import com.mycompany.jobs.DefaultJob;
//import com.mycompany.models.ConfigModel;
//import com.mycompany.services.HttpService;
//import org.apache.commons.io.FileUtils;
//import org.bson.types.ObjectId;
//import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
//import org.elasticsearch.action.delete.DeleteRequest;
//import org.elasticsearch.action.get.GetRequest;
//import org.elasticsearch.client.RequestOptions;
//import org.elasticsearch.client.RestHighLevelClient;
//import org.elasticsearch.client.indices.GetIndexRequest;
//import org.elasticsearch.client.indices.GetIndexResponse;
//import org.json.simple.JSONObject;
//import org.json.simple.parser.JSONParser;
//import org.json.simple.parser.ParseException;
//import org.junit.After;
//import org.junit.Before;
//import org.junit.Test;
//
//import java.io.File;
//import java.io.FileReader;
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.junit.Assert.assertTrue;
//
//
//public class EndToEndTest implements Log {
//    private Injector injector;
//    private ConfigModel configModel;
//    private String jobId = new ObjectId().toString();
//    private String userId = new ObjectId().toString();
//    private String email;
//    private String password;
//    private String aggId = new ObjectId().toString();
//    private HttpService httpService;
//    private Map<String, String> defaultHeaders = new HashMap<String, String>() {{
//        put("Content-Type", "application/json");
//        put("cache-control", "no-cache");
//    }};
//
//    @Before
//    public void setup() throws IOException, ParseException, UnirestException {
//        injector = Guice.createInjector(new TestModule(jobId));
//        configModel = injector.getInstance(ConfigModel.class);
//        httpService = injector.getInstance(HttpService.class);
//
//        tearDown();
//
//        createTestRecord("testUsers.json", "user", userId);
//        createTestRecord("testJob.json", "job", jobId);
//        createTestRecord("testAggregations.json", "aggregation", aggId);
//
//        setUpFileStructure();
//    }
//
//    @After
//    public void tearDown() throws IOException {
//        deleteTestRecord("testUsers.json", "user", userId);
//        deleteTestRecord("testJob.json", "job", jobId);
//        deleteTestRecord("testAggregations.json", "aggregation", aggId);
//
//        deleteKibanaEntity("visualization", String.format("%s_%s_markdown", jobId, aggId));
//        deleteKibanaEntity("visualization", String.format("%s_%s_bar", jobId, aggId));
//        deleteKibanaEntity("dashboard", String.format("%s_dashboard", jobId));
//        deleteKibanaEntity("index-pattern", aggId);
//
//        if (elasticsearchIndexExists(aggId)) {
//            deleteElasticsearchIndex(aggId);
//        }
//
//        deleteFolder(userId);
//    }
//
//    @Test
//    public void simpleDashboardTest() throws IOException, ParseException, UnirestException {
//        DefaultJob job = injector.getInstance(DefaultJob.class);
//        job.run(jobId, userId);
//
//        assertTrue(elasticsearchIndexExistsOnce(aggId));
//        assertTrue(kibanaEntityExists("index-pattern", aggId));
//        assertTrue(kibanaEntityExists("visualization", String.format("%s_%s_markdown", jobId, aggId)));
//        assertTrue(kibanaEntityExists("visualization", String.format("%s_%s_bar", jobId, aggId)));
//        assertTrue(kibanaEntityExists("dashboard", String.format("%s_dashboard", jobId)));
//
//        assertTrue(fileExists("staging"));
//    }
//
//    private void setUpFileStructure() throws IOException {
//        File source = new File("src/test/test-resources/root/pp-2018-part1.csv");
//        File dest = new File(String.format("src/test/test-resources/root/%s/%s/raw/pp-2018-part1.csv", userId, jobId));
//
//        FileUtils.copyFile(source, dest);
//    }
//
//    private void createTestRecord(String fileName, String url, String id) throws IOException, ParseException, UnirestException {
//        JSONParser jsonParser = new JSONParser();
//        File f = new File(fileName);
//        String actualPath = f.getAbsolutePath().substring(0, f.getAbsolutePath().length() - fileName.length()) + "src/test/test-resources/" + fileName;
//
//        FileReader reader = new FileReader(actualPath);
//        JSONObject obj = (JSONObject) jsonParser.parse(reader);
//        obj.put("_id", id);
//
//        if (url.equals("job")) {
//            obj.put("userId", userId);
//        } else if (url.equals("aggregation")) {
//            obj.put("jobId", jobId);
//        } else {
//            email = obj.get("email").toString();
//            password = obj.get("password").toString();
//        }
//
//        HttpResponse<String> response;
//        Map<String, String> newDefaultHeaders = new HashMap<String, String>() {{
//            put("Content-Type", "application/json");
//            put("cache-control", "no-cache");
//        }};
//
//        if (url.equals("user") || url.equals("job")) {
//            response = httpService.post(configModel.mongodbRootUrl() + url, newDefaultHeaders, obj.toString(), email, password);
//        } else {
//            response = httpService.post(configModel.mongodbRootUrl() + url, newDefaultHeaders, obj.toString(), jobId);
//        }
//
//        logger().info(response.getStatusText(), response.getBody());
//    }
//
//    private void deleteTestRecord(String fileName, String url, String id) {
//        JSONParser jsonParser = new JSONParser();
//        File f = new File(fileName);
//        String actualPath = f.getAbsolutePath().substring(0, f.getAbsolutePath().length() - fileName.length()) + "src/test/test-resources/" + fileName;
//
//        try (FileReader reader = new FileReader(actualPath)){
//            JSONObject obj = (JSONObject) jsonParser.parse(reader);
//            obj.put("_id", id);
//            JSONObject entity = (JSONObject) obj;
//            httpService.delete(String.format("%s%s/%s", configModel.mongodbRootUrl(), url, entity.get("_id")), defaultHeaders, jobId);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private String getEntityId(String fileName) throws IOException, ParseException {
//        JSONParser jsonParser = new JSONParser();
//        File f = new File(fileName);
//        String actualPath = f.getAbsolutePath().substring(0, f.getAbsolutePath().length() - fileName.length()) + "src/test/test-resources/" + fileName;
//
//        FileReader reader = new FileReader(actualPath);
//        Object obj = jsonParser.parse(reader);
//        JSONObject entity = (JSONObject) obj;
//        return entity.get("_id").toString();
//    }
//
//    private boolean elasticsearchIndexExistsOnce(String indexId) throws IOException {
//        RestHighLevelClient client = injector.getInstance(RestHighLevelClient.class);
//        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId + "*");
//        GetIndexResponse getIndexResponse = client.indices().get(getIndexRequest, RequestOptions.DEFAULT);
//        return getIndexResponse.getIndices().length == 1;
//    }
//
//    private boolean elasticsearchIndexExists(String indexId) throws IOException {
//        RestHighLevelClient client = injector.getInstance(RestHighLevelClient.class);
//        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId);
//        return client.indices().exists(getIndexRequest, RequestOptions.DEFAULT);
//    }
//
//    private boolean kibanaEntityExists(String entitySuperType, String id) throws IOException {
//        RestHighLevelClient client = injector.getInstance(RestHighLevelClient.class);
//        String entityId = String.format("%s:%s", entitySuperType, id);
//        GetRequest getRequest = new GetRequest(".kibana", entityId);
//        return client.exists(getRequest, RequestOptions.DEFAULT);
//    }
//
//    private void deleteKibanaEntity(String entitySuperType, String id) throws IOException {
//        RestHighLevelClient client = injector.getInstance(RestHighLevelClient.class);
//        String entityId = String.format("%s:%s", entitySuperType, id);
//        DeleteRequest deleteRequest = new DeleteRequest(".kibana", entityId);
//        client.delete(deleteRequest, RequestOptions.DEFAULT);
//
//        //DeleteResponse response = client.delete(deleteRequest, RequestOptions.DEFAULT);
//        //return response.getResult() == DocWriteResponse.Result.DELETED;
//    }
//
//    private void deleteElasticsearchIndex(String indexId) throws IOException {
//        RestHighLevelClient client = injector.getInstance(RestHighLevelClient.class);
//
//        GetIndexRequest getIndexRequest = new GetIndexRequest(indexId + "*");
//        GetIndexResponse getIndexResponse = client.indices().get(getIndexRequest, RequestOptions.DEFAULT);
//
//        String indexToDeleteId = getIndexResponse.getIndices()[0];
//
//        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest(indexToDeleteId);
//        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
//    }
//
//    private boolean fileExists(String folderName) {
//        String actualPath = String.format("%s/%s/%s/%s", configModel.stagingFolder(), userId, jobId, folderName);
//        File f = new File(actualPath);
//        return f.exists() && f.isDirectory();
//    }
//
//    private void deleteFolder(String folderName) throws IOException {
//        File f = new File(String.format("%s/%s/", configModel.stagingFolder(), folderName));
//        FileUtils.deleteDirectory(f);
//    }
//}
