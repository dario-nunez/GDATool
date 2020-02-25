package com.mycompany.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.AggregationModel;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponseFactory;
import org.apache.http.HttpStatus;
import org.apache.http.HttpVersion;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.DefaultHttpResponseFactory;
import org.apache.http.message.BasicStatusLine;
import com.mashape.unirest.http.HttpResponse;
import org.junit.Before;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Matchers.anyMapOf;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class MongodbRepositoryTest {
    private ObjectMapper objectMapper;

    @Mock
    HttpService httpServiceMock;

    private String aggregationsFileContent;

    @Before
    public void setup() throws IOException {
        this.objectMapper = new ObjectMapper();
        ClassLoader classLoader = getClass().getClassLoader();
        File aggregationsFile = new File(classLoader.getResource("testAggregations.json").getFile());
        aggregationsFileContent = FileUtils.readFileToString(aggregationsFile, StandardCharsets.UTF_8);
        MockitoAnnotations.initMocks(this);
    }

    /**
     * Tests that MongoRepository.loadAggregations() converts a response body to the appropriate
     * JSON array of AggregationModel.
     */
    @Test
    public void loadAggregations() throws UnirestException, IOException {
        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(aggregationsFileContent));
        DependencyFactory dependencyFactory = new TestDependencyFactory();
        MongodbRepository mongodbRepository = new MongodbRepository(dependencyFactory.getConfigModel(), httpServiceMock);

        List<AggregationModel> actualAggregations =  mongodbRepository.loadAggregations("");
        List<AggregationModel> expectedAggregations = objectMapper.readValue(aggregationsFileContent, new TypeReference<List<AggregationModel>>(){});

        assertEquals(expectedAggregations, actualAggregations);
    }

    @Test
    public void loadPlots() {

    }

    private HttpResponse<String> getHttpResponse(String content) {
        HttpResponseFactory factory = new DefaultHttpResponseFactory();
        org.apache.http.HttpResponse response = factory.newHttpResponse(
                new BasicStatusLine(HttpVersion.HTTP_1_1, HttpStatus.SC_OK, null), null);
        response.setEntity(new StringEntity(content, ContentType.APPLICATION_JSON));
        return new HttpResponse<>(response, String.class);
    }
}