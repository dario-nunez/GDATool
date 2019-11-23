package com.mycompany.services.bi;

import com.google.inject.Inject;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import com.mycompany.services.HttpService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * The "Simple Dashboard" method makes the following: 1 index-pattern, 1 markdown visualization, 1 bar chart
 * visualization and 1 dashboard.
 *
 * Due to the naming convention used, only 1 visualization of each type is added to the "Simple Dashboard", otherwise
 * one of them will be overwritten. If this is to be overcome, a random number generator or hashing function can be used
 * to differentiate between visualizations corresponding to a specific aggregation record ID.
 */
public class BiRepository {
    private final ConfigModel configModel;
    private final HttpService httpService;

    private final Map<String, String> defaultHeaders = new HashMap<String, String>() {{
        put("Content-Type", "application/json");
        put("cache-control", "no-cache");
    }};

    @Inject
    public BiRepository(ConfigModel configModel, HttpService httpService) {
        this.configModel = configModel;
        this.httpService = httpService;
    }

    public void generateBasicDashboard(JobModel job) throws IOException, UnirestException {
        httpService.get(String.format("%sdashboardBuilder/basic/%s", configModel.elasticsearchServiceRootUrl(), job._id()), defaultHeaders);
    }
}