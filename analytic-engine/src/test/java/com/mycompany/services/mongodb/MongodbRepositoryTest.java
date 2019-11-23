package com.mycompany.services.mongodb;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.TestModule;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.services.HttpService;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponseFactory;
import org.apache.http.HttpStatus;
import org.apache.http.HttpVersion;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.DefaultHttpResponseFactory;
import org.apache.http.message.BasicStatusLine;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.anyMapOf;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

public class MongodbRepositoryTest {

    private Injector injector;

    @Mock
    HttpService httpServiceMock;

    private String aggregationsFileContent;

    @Before
    public void setup() throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        File aggregationsFile = new File(classLoader.getResource("aggregations.json").getFile());
        aggregationsFileContent =  FileUtils.readFileToString(aggregationsFile, StandardCharsets.UTF_8);
        MockitoAnnotations.initMocks(this);
        injector = Guice.createInjector(new TestModule(""));
    }

    @Test
    public void loadAggregations() throws IOException, UnirestException {
        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(aggregationsFileContent));
        MongodbRepository mongodbRepository = new MongodbRepository(injector.getInstance(ConfigModel.class),
                httpServiceMock);
        List<AggregationModel> actualAggregations = mongodbRepository.loadAggregations("");
        ObjectMapper mapper = new ObjectMapper();
        CollectionType javaType = mapper.getTypeFactory().constructCollectionType(List.class, AggregationModel.class);

        mapper.registerModule(new GuavaModule());
        List<AggregationModel> expectedAggregations = mapper.readValue(aggregationsFileContent, javaType);
        assertEquals(expectedAggregations.size(), actualAggregations.size());
        for (int i = 0; i < expectedAggregations.size(); i++) {
            assertEquals(expectedAggregations.get(i), actualAggregations.get(i));
        }
    }

    @Test
    public void loadAggregation_hittingTheServer() throws IOException, UnirestException {
        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(aggregationsFileContent));
        MongodbRepository mongodbRepository = new MongodbRepository(injector.getInstance(ConfigModel.class),
                httpServiceMock);
        List<AggregationModel> actualAggregations = mongodbRepository.loadAggregations("job1");
        assertNotNull(actualAggregations);
    }

    @Test
    public void getJobsByIds() {
    }

    @Test
    public void getJobIdsByUserIds() {
    }

    private HttpResponse<String> getHttpResponse(String content) {
        HttpResponseFactory factory = new DefaultHttpResponseFactory();
        org.apache.http.HttpResponse response = factory.newHttpResponse(new BasicStatusLine(HttpVersion.HTTP_1_1, HttpStatus.SC_OK, null), null);
        response.setEntity(new StringEntity(content, ContentType.APPLICATION_JSON));
        return new HttpResponse<>(response, String.class);
    }
}