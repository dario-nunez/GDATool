package com.mycompany.run;

import com.mycompany.configuration.DependencyFactory;
import com.mycompany.configuration.Environment;
import com.mycompany.jobs.SchemaInferenceJob;

import com.mashape.unirest.http.exceptions.UnirestException;

import java.io.IOException;

/**
 * Schema Inference Main is the triggering class for the Schema Inference job. Main parses command line arguments,
 * creates a dependency factory and calls the run method of a SchemaInferenceJob instance.
 */
public class SchemaInferenceMain {
    public static void main(String[] args) throws IOException, UnirestException {
        // Parse command line arguments
        Environment env = Environment.valueOf(args[0]);
        String userId = args[1];
        String jobId = args[2];

        // Creates the DependencyFactory containing: ConfigModel, SparkSession, etc...
        DependencyFactory dependencyFactory = new DependencyFactory(env);

        // Create and run the SchemaInferenceJob
        SchemaInferenceJob schemaInferenceJob = new SchemaInferenceJob(dependencyFactory.getSparkSession(),
                dependencyFactory.getConfigModel(), dependencyFactory.getMongodbRepository(),
                dependencyFactory.getElasticsearchRepository());

        schemaInferenceJob.run(userId, jobId);
    }
}
