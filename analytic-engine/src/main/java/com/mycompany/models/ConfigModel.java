package com.mycompany.models;

import org.immutables.value.Value;

/**
 * Represents an immutable Configuration object. It contains information about the application and its dependencies.
 */
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
