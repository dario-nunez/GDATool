package com.mycompany.services;

import com.mycompany.configuration.Log;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;

import com.mashape.unirest.http.exceptions.UnirestException;

import java.util.HashMap;
import java.util.Map;

public class ElasticsearchRepository implements Log {
    private ConfigModel configModel;
    private HttpService httpService;

    private final Map<String, String> defaultHeaders = new HashMap<String, String>() {{
        put("Content-Type", "application/json");
        put("cache-control", "no-cache");
    }};

    public ElasticsearchRepository(ConfigModel configModel, HttpService httpService) {
        this.configModel = configModel;
        this.httpService = httpService;
    }

    public void generateBasicDashboard(JobModel job) throws UnirestException {
        httpService.get(String.format("%sdashboardBuilder/basic/%s", configModel.elasticsearchServiceUrl(), job._id), defaultHeaders);
    }
}