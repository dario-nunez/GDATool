package com.mycompany.services;

import com.mycompany.configuration.Log;
import com.mycompany.models.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.exceptions.UnirestException;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

/**
 * The interface to the mongodb-service. Contains wrappers around all the methods that can be called from the
 * analytic-engine.
 */
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

    /**
     * Get all aggregations linked to a job.
     * @param jobId
     * @return a list of AggregationModels.
     * @throws UnirestException
     * @throws IOException
     */
    public List<AggregationModel> loadAggregations(String jobId) throws UnirestException, IOException {
        HttpResponse<String> response = httpService.get(String.format("%saggregation/byJob/%s", configModel.mongodbServiceUrl(), jobId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<List<AggregationModel>>(){});
    }

    /**
     * Get all plots linked to a job.
     * @param jobId
     * @return a list of PlotModels.
     * @throws UnirestException
     * @throws IOException
     */
    public List<PlotModel> loadPlots(String jobId) throws UnirestException, IOException {
        HttpResponse<String> response = httpService.get(String.format("%splot/byJob/%s", configModel.mongodbServiceUrl(), jobId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<List<PlotModel>>(){});
    }

    /**
     * Get all clusters linked to an aggregation.
     * @param aggId
     * @return a list of ClusterModels.
     * @throws UnirestException
     * @throws IOException
     */
    public List<ClusterModel> loadClusters(String aggId) throws UnirestException, IOException {
        HttpResponse<String> response = httpService.get(String.format("%scluster/byAgg/%s", configModel.mongodbServiceUrl(), aggId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<List<ClusterModel>>(){});
    }

    /**
     * Get all filters linked to an aggregation.
     * @param aggId
     * @return a list of FilterModels.
     * @throws UnirestException
     * @throws IOException
     */
    public List<FilterModel> loadFilters(String aggId) throws UnirestException, IOException {
        HttpResponse<String> response = httpService.get(String.format("%sfilter/byAgg/%s", configModel.mongodbServiceUrl(), aggId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<List<FilterModel>>(){});
    }

    /**
     * Get a job by its id.
     * @param jobId
     * @return a JobModel object.
     * @throws IOException
     * @throws UnirestException
     */
    public JobModel getJobById(String jobId) throws IOException, UnirestException {
        HttpResponse<String> response = httpService.get(String.format("%sjob/%s", configModel.mongodbServiceUrl(), jobId),
                new HashMap<String, String>(){{
                    put("cache-control", "no-cache");
                }});
        String jsonData = response.getBody();
        return objectMapper.readValue(jsonData, new TypeReference<JobModel>(){});
    }

    /**
     * Mark a job as complete by changing its jobStatus field to a value of 5.
     * @param job
     * @return a JodModel object containing a jobStatus of 5.
     * @throws UnirestException
     * @throws IOException
     */
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
