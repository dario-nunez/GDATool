package com.mycompany.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.*;
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
import java.util.Objects;

import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Matchers.anyMapOf;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import static org.junit.Assert.assertEquals;

public class MongodbRepositoryTest {
    private ObjectMapper objectMapper;
    private ClassLoader classLoader;
    private MongodbRepository mongodbRepository;

    @Mock
    HttpService httpServiceMock;

    @Before
    public void setup() throws IOException {
        this.objectMapper = new ObjectMapper();
        classLoader = getClass().getClassLoader();
        MockitoAnnotations.initMocks(this);
        DependencyFactory dependencyFactory = new TestDependencyFactory();
        mongodbRepository = new MongodbRepository(dependencyFactory.getConfigModel(), httpServiceMock);
    }

    /**
     * Tests that MongoRepository.loadAggregations() converts a response body to the appropriate
     * JSON array of AggregationModel.
     */
    @Test
    public void loadAggregations() throws UnirestException, IOException {
        File aggregationsFile = new File(Objects.requireNonNull(classLoader.getResource("testAggregations.json")).getFile());
        String aggregationsFileContent = FileUtils.readFileToString(aggregationsFile, StandardCharsets.UTF_8);

        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(aggregationsFileContent));

        List<AggregationModel> actualAggregations =  mongodbRepository.loadAggregations("");
        List<AggregationModel> expectedAggregations = objectMapper.readValue(aggregationsFileContent, new TypeReference<List<AggregationModel>>(){});

        assertEquals(expectedAggregations, actualAggregations);
    }

    @Test
    public void loadPlots() throws IOException, UnirestException {
        File plotsFile = new File(Objects.requireNonNull(classLoader.getResource("testPlots.json")).getFile());
        String plotsFileContents = FileUtils.readFileToString(plotsFile, StandardCharsets.UTF_8);

        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(plotsFileContents));

        List<PlotModel> actualPlots =  mongodbRepository.loadPlots("");
        List<PlotModel> expectedPlots = objectMapper.readValue(plotsFileContents, new TypeReference<List<PlotModel>>(){});

        assertEquals(expectedPlots, actualPlots);
    }

    @Test
    public void loadClusters() throws IOException, UnirestException {
        File clustersFile = new File(Objects.requireNonNull(classLoader.getResource("testClusters.json")).getFile());
        String clustersFileContents = FileUtils.readFileToString(clustersFile, StandardCharsets.UTF_8);

        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(clustersFileContents));

        List<ClusterModel> actualClusters =  mongodbRepository.loadClusters("");
        List<ClusterModel> expectedClusters = objectMapper.readValue(clustersFileContents, new TypeReference<List<ClusterModel>>(){});

        assertEquals(expectedClusters, actualClusters);
    }

    @Test
    public void loadFilters() throws IOException, UnirestException {
        File filtersFile = new File(Objects.requireNonNull(classLoader.getResource("testFilters.json")).getFile());
        String filtersFileContents = FileUtils.readFileToString(filtersFile, StandardCharsets.UTF_8);

        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(filtersFileContents));

        List<FilterModel> actualFilters =  mongodbRepository.loadFilters("");
        List<FilterModel> expectedFilters = objectMapper.readValue(filtersFileContents, new TypeReference<List<FilterModel>>(){});

        assertEquals(expectedFilters, actualFilters);
    }

    @Test
    public void getJobById() throws IOException, UnirestException {
        File jobFile = new File(Objects.requireNonNull(classLoader.getResource("testJobs.json")).getFile());
        String jobFileContents = FileUtils.readFileToString(jobFile, StandardCharsets.UTF_8);

        when(httpServiceMock.get(anyString(), anyMapOf(String.class, String.class)))
                .thenReturn(getHttpResponse(jobFileContents));

        JobModel actualJob =  mongodbRepository.getJobById("");
        JobModel expectedJob = objectMapper.readValue(jobFileContents, new TypeReference<JobModel>(){});

        assertEquals(expectedJob, actualJob);
    }

    /**
     * Doesn't test that the job status is increased by one as this is done by the caller. It is just
     * testing the JSON conversion in that method.
     */
    @Test
    public void markJobAsComplete() throws IOException, UnirestException {
        File jobFile = new File(Objects.requireNonNull(classLoader.getResource("testJobs.json")).getFile());
        String jobFileContents = FileUtils.readFileToString(jobFile, StandardCharsets.UTF_8);

        when(httpServiceMock.put(anyString(), anyMapOf(String.class, String.class), anyString()))
                .thenReturn(getHttpResponse(jobFileContents));

        JobModel actualJob =  mongodbRepository.markJobAsComplete(new JobModel());
        JobModel expectedJob = objectMapper.readValue(jobFileContents, new TypeReference<JobModel>(){});

        assertEquals(expectedJob, actualJob);
    }

    private HttpResponse<String> getHttpResponse(String content) {
        HttpResponseFactory factory = new DefaultHttpResponseFactory();
        org.apache.http.HttpResponse response = factory.newHttpResponse(
                new BasicStatusLine(HttpVersion.HTTP_1_1, HttpStatus.SC_OK, null), null);
        response.setEntity(new StringEntity(content, ContentType.APPLICATION_JSON));
        return new HttpResponse<>(response, String.class);
    }
}