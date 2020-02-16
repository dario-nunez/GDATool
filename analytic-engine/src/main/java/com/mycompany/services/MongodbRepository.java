package com.mycompany.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.configuration.Log;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public class MongodbRepository implements Log {
    private ObjectMapper objectMapper;
    private ConfigModel configModel;
    private HttpService httpService;

    public MongodbRepository(ConfigModel configModel, HttpService httpService) {
        this.objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        this.configModel = configModel;
        this.httpService = httpService;
    }

    public List<AggregationModel> loadAggregations(String jobId) throws UnirestException, IOException {
        HttpResponse<String> response = httpService.get(String.format("%saggregation/byJob/%s", configModel.mongodbServiceUrl(), jobId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<List<AggregationModel>>(){});
    }

    public JobModel getJobById(String jobId) throws IOException, UnirestException {
        HttpResponse<String> response = httpService.get(String.format("%sjob/%s", configModel.mongodbServiceUrl(), jobId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<JobModel>(){});
    }

    public JobModel markJobAsComplete(JobModel job) throws UnirestException, IOException {
        String jobJson = objectMapper.writeValueAsString(job);
        HttpResponse<String> response = httpService.put(String.format("%sjob/%s", configModel.mongodbServiceUrl(), job._id),
                new HashMap<String, String>() {{
                    put("Content-Type", "application/json");
                    put("cache-control", "no-cache");
                }}, jobJson);
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<JobModel>(){});
    }
}