package com.mycompany.run;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.configuration.Environment;
import com.mycompany.jobs.DataAnalysisJob;

import java.io.IOException;

/**
 * Data analysis job.
 * Performs aggregations on a given dataset found in the /raw directory of the given job. Stores the results in the
 * /staging folder and also in Elasticsearch.
 */
public class DataAnalysisMain {
    public static void main(String[] args) throws IOException, UnirestException {
        // Parse command line arguments
        Environment env = Environment.valueOf(args[0]);
        String userId = args[1];
        String jobId = args[2];

        // Creates the DependencyFactory containing: ConfigModel, SparkSession, etc...
        DependencyFactory dependencyFactory = new DependencyFactory(env, jobId);

        // Create and run the SchemaInferenceJob
        DataAnalysisJob dataAnalysisJob = new DataAnalysisJob(dependencyFactory.getSparkSession(),
                dependencyFactory.getConfigModel(), dependencyFactory.getMongodbRepository(),
                dependencyFactory.getElasticsearchRepository(), dependencyFactory.getUserDefinedFunctionsFactory(),
                dependencyFactory.getRestHighLevelClient());

        dataAnalysisJob.run(userId, jobId);
    }
}
