package com.mycompany.configuration;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClientBuilder;

public class HttpFactory {

    public HttpClient getHttpClient() {
        return HttpClientBuilder.create().build();
    }

    public HttpGet getHttpGet(String uri) {
        return new HttpGet(uri);
    }

    public HttpPost getHttPost(String uri) {
        return new HttpPost(uri);
    }
}
