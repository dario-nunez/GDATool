package com.mycompany.services;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.configuration.Log;
import com.mycompany.models.ConfigModel;

import java.util.Map;

public class HttpService implements Log {
    private ConfigModel configModel;
    private String jodId;

    public HttpService(ConfigModel configModel, String jobId) {
        this.configModel = configModel;
        this.jodId = jobId;
    }

    public HttpResponse<String> get(String url, Map<String, String> headers) throws UnirestException {
        logger().info("Http get to {}", url);
        return Unirest.get(url)
                .headers(headers)
                .asString();
    }

    public HttpResponse<String> post(String url, Map<String, String> headers, String body, String email, String password) throws UnirestException {
        logger().info("Http post to {} with body {}", url, body);
        return Unirest.post(url)
                .headers(headers)
                .body(body)
                .asString();
    }

    public HttpResponse<String> post(String url, Map<String, String> headers, String body, String jobId) throws UnirestException {
        logger().info("Http post to {} with body {}", url, body);
        return Unirest.post(url)
                .headers(headers)
                .body(body)
                .asString();
    }

    public HttpResponse<String> delete(String url, Map<String, String> headers, String jobId) throws UnirestException {
        logger().info("Http delete to {}", url);
        return Unirest.delete(url)
                .headers(headers)
                .asString();
    }
}
