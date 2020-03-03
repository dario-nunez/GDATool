package com.mycompany.services;

import com.mycompany.configuration.Log;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;

import com.mashape.unirest.http.exceptions.UnirestException;

import java.util.HashMap;
import java.util.Map;

/**
 * The interface to the elasticsearch-service. Contains wrappers around all the methods that can be called from the
 * analytic-engine.
 */
public class ElasticsearchRepository implements Log {
    private ConfigModel configModel;
    private HttpService httpService;

    // Define common headers.
    private final Map<String, String> defaultHeaders = new HashMap<String, String>() {{
        put("Content-Type", "application/json");
        put("cache-control", "no-cache");
    }};

    public ElasticsearchRepository(ConfigModel configModel, HttpService httpService) {
        this.configModel = configModel;
        this.httpService = httpService;
    }

    /**
     * Trigger the creation of a dashboard of the "basic" type in the elasticsearch-service.
     * @param job: the JobModel associated with the request.
     * @throws UnirestException
     */
    public void generateBasicDashboard(JobModel job) throws UnirestException {
        httpService.get(String.format("%sdashboardBuilder/basic/%s", configModel.elasticsearchServiceUrl(), job._id), defaultHeaders);
    }
}