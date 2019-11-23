package com.mycompany.services.mongodb;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.google.inject.Inject;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.configuration.Log;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import com.mycompany.services.HttpService;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

/**
 * This will query the mongodb service.
 */
public class MongodbRepository implements Log {

    private final ConfigModel configModel;
    private HttpService httpService;

    @Inject
    public MongodbRepository(ConfigModel configModel, HttpService httpService) {
        this.configModel = configModel;
        this.httpService = httpService;
    }

    public List<AggregationModel> loadAggregations(String jobId) throws UnirestException, IOException {
        HttpResponse<String> response = httpService.get(String.format("%saggregation/byJob/%s", configModel.mongodbRootUrl(), jobId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new GuavaModule());
        CollectionType javaType = mapper.getTypeFactory().constructCollectionType(List.class, AggregationModel.class);
        return mapper.readValue(jsonData, javaType);
    }

    public JobModel getJobById(String jobId) throws IOException, UnirestException {
        HttpResponse<String> response = httpService.get(String.format("%sjob/%s", configModel.mongodbRootUrl(), jobId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new GuavaModule());
        CollectionType javaType = mapper.getTypeFactory().constructCollectionType(List.class, JobModel.class);
        return ((List<JobModel>) mapper.readValue("[" + jsonData + "]", javaType)).get(0);
    }

    public List<String> getJobIdsByUserIds(List<String> userIds) {
        return Collections.emptyList();
    }
}
