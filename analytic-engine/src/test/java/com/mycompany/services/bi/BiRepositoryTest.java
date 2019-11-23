package com.mycompany.services.bi;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.TestModule;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableJobModel;
import com.mycompany.models.JobModel;
import com.mycompany.services.HttpService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.times;

public class BiRepositoryTest {

    @Mock
    HttpService httpServiceMock;

    private Injector injector;
    private ConfigModel configModel;

    Map<String, String> expectedHeaders = new HashMap<String, String>() {{
        put("Content-Type", "application/json");
        put("cache-control", "no-cache");
    }};

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        injector = Guice.createInjector(new TestModule(""));
        configModel = injector.getInstance(ConfigModel.class);
    }

    @Test
    public void generateDashboard_callTheRightEndpoint() throws UnirestException, IOException {
        String expectedUrl = configModel.elasticsearchServiceRootUrl() + "dashboardBuilder/basic/118cg";
        BiRepository biRepository = new BiRepository(configModel, httpServiceMock);
        JobModel jobModel = ImmutableJobModel.builder()
                ._id("118cg")
                .description("Test job")
                .userId("Test user")
                .rawInputDirectory("raw")
                .stagingFileName("staging")
                .createdAt("2019-09-22T12:52:37.570Z")
                .updatedAt("2019-09-22T12:52:37.570Z")
                .build();
        biRepository.generateBasicDashboard(jobModel);
        Mockito.verify(httpServiceMock, times(1)).get(eq(expectedUrl), eq(expectedHeaders));
    }
}