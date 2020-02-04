package com.mycompany.run;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.configuration.Environment;
import com.mycompany.jobs.SchemaInferenceJob;

import java.io.IOException;

/**
 * Schema inference job.
 * Creates a detailed schema file from the data in the /raw directory of the job and saves it in the same location
 */
public class SchemaInferenceMain {
    public static void main(String[] args) throws IOException, UnirestException {
        // Parse command line arguments
        Environment env = Environment.valueOf(args[0]);
        String userId = args[1];
        String jobId = args[2];

        // Creates the DependencyFactory containing: ConfigModel, SparkSession, etc...
        DependencyFactory dependencyFactory = new DependencyFactory(env, jobId);

        // Create and run the SchemaInferenceJob
        SchemaInferenceJob schemaInferenceJob = new SchemaInferenceJob(dependencyFactory.getSparkSession(),
                dependencyFactory.getConfigModel(), dependencyFactory.getMongodbRepository(),
                dependencyFactory.getElasticsearchRepository(), dependencyFactory.getUserDefinedFunctionsFactory(),
                dependencyFactory.getRestHighLevelClient());

        schemaInferenceJob.run(userId, jobId);
    }
}
