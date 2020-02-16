package com.mycompany.models;

import org.immutables.value.Value;

@Value.Immutable
public interface ConfigModel {
    String awsAccessKeyIdEnvVariable();
    String awsSecretAccessKeyEnvVariable();
    String appName();
    String bucketRoot();
    String stagingFolder();
    String elasticsearchUrl();
    String elasticsearchPort();
    String master();
    String mongodbServiceUrl();
    String elasticsearchServiceUrl();
}
