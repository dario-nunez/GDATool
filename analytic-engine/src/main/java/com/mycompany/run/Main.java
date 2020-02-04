package com.mycompany.run;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.configuration.DependenciesFactory;
import com.mycompany.configuration.Environment;
import com.mycompany.jobs.SchemaInferenceJob;

import java.io.IOException;

public class Main {

    public static void main(String[] args) throws IOException, UnirestException {
//        System.setProperty("https.protocols","TLSv1,TLSv1.1,TLSv1.2");
        Environment env = Environment.valueOf(args[0]);
        String jobId = args[1];
        String userId = args[2];
//        Injector injector = Guice.createInjector(new Module(env));
//        DefaultJob job = injector.getInstance(DefaultJob.class);
        DependenciesFactory dependenciesFactory = new DependenciesFactory(env, jobId);

        // Have an extra argument specifying which job to run: inference or analysis
        SchemaInferenceJob schemaInferenceJob = new SchemaInferenceJob(dependenciesFactory.sparkSession(), dependenciesFactory.configModel(),
                dependenciesFactory.mongodbRepository(), dependenciesFactory.biRepository(),
                dependenciesFactory.userDefinedFunctionsFactory(),
                dependenciesFactory.restHighLevelClient());
        schemaInferenceJob.run(jobId, userId);

//        DefaultJob job = new DefaultJob(dependenciesFactory.sparkSession(), dependenciesFactory.configModel(),
//                dependenciesFactory.mongodbRepository(), dependenciesFactory.biRepository(),
//                dependenciesFactory.userDefinedFunctionsFactory(),
//                dependenciesFactory.restHighLevelClient());
//        job.run(jobId, userId);
    }
}
