package com.mycompany.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.times;

/**
 * This file tests the ElasticsearchRepository methods.
 */
public class ElasticsearchRepositoryTest {
    @Mock
    HttpService httpServiceMock;

    private ObjectMapper objectMapper;
    private ClassLoader classLoader;
    private ConfigModel configModel;

    Map<String, String> expectedHeaders = new HashMap<String, String>() {{
        put("Content-Type", "application/json");
        put("cache-control", "no-cache");
    }};

    public ElasticsearchRepositoryTest() throws IOException {
        MockitoAnnotations.initMocks(this);
        DependencyFactory dependencyFactory = new TestDependencyFactory();
        configModel = dependencyFactory.getConfigModel();
        classLoader = getClass().getClassLoader();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Should call the dashboard generating endpoint exactly one time.
     * @throws UnirestException
     * @throws IOException
     */
    @Test
    public void generateDashboard_callTheExpectedEndpointOnce() throws UnirestException, IOException {
        File jobFile = new File(Objects.requireNonNull(classLoader.getResource("testJobs.json")).getFile());
        String jobFileContents = FileUtils.readFileToString(jobFile, StandardCharsets.UTF_8);
        JobModel jobModel = objectMapper.readValue(jobFileContents, new TypeReference<JobModel>(){});

        String expectedUrl = configModel.elasticsearchServiceUrl() + "dashboardBuilder/basic/" + jobModel._id;
        ElasticsearchRepository elasticsearchRepository = new ElasticsearchRepository(configModel, httpServiceMock);

        elasticsearchRepository.generateBasicDashboard(jobModel);

        Mockito.verify(httpServiceMock, times(1)).get(eq(expectedUrl), eq(expectedHeaders));
    }
}