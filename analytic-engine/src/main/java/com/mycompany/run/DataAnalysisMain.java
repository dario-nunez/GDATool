package com.mycompany.run;

import com.mycompany.configuration.DependencyFactory;
import com.mycompany.configuration.Environment;
import com.mycompany.jobs.DataAnalysisJob;

import com.mashape.unirest.http.exceptions.UnirestException;

import java.io.IOException;

/**
 * Data Analysis Main is the triggering class for the Data Analysis job. Main parses command line arguments, creates a
 * dependency factory and calls the run method of a DataAnalysisJob instance.
 */
public class DataAnalysisMain {
    public static void main(String[] args) throws IOException, UnirestException {
        // Parse command line arguments
        Environment env = Environment.valueOf(args[0]);
        String userId = args[1];
        String jobId = args[2];

        // Creates the DependencyFactory containing: ConfigModel, SparkSession, etc...
        DependencyFactory dependencyFactory = new DependencyFactory(env);

        // Create and run the SchemaInferenceJob
        DataAnalysisJob dataAnalysisJob = new DataAnalysisJob(dependencyFactory.getSparkSession(),
                dependencyFactory.getConfigModel(), dependencyFactory.getMongodbRepository(),
                dependencyFactory.getElasticsearchRepository(),
                dependencyFactory.getRestHighLevelClient());

        dataAnalysisJob.run(userId, jobId);
    }
}
