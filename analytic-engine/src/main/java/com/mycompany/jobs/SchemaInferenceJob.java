package com.mycompany.jobs;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.*;
import com.mycompany.services.bi.BiRepository;
import com.mycompany.services.MongodbRepository;
import org.apache.spark.sql.*;
import org.apache.spark.sql.types.StructField;
import org.elasticsearch.client.RestHighLevelClient;
import org.json.simple.JSONObject;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import com.amazonaws.SdkClientException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import static org.apache.spark.sql.functions.*;

public class SchemaInferenceJob extends Job {

    private final RestHighLevelClient hlClient;

    @Inject
    public SchemaInferenceJob(SparkSession sparkSession, ConfigModel configModel,
                      MongodbRepository mongodbRepository,
                      BiRepository biRepository,
                      UserDefinedFunctionsFactory userDefinedFunctionsFactory,
                      RestHighLevelClient hlClient) {
        super(sparkSession, configModel, mongodbRepository, biRepository, userDefinedFunctionsFactory);
        this.hlClient = hlClient;
        logger = LoggerFactory.getLogger(DefaultJob.class);
    }

    public void run(String jobId, String userId) throws IOException, UnirestException {
        logger.info("Inference job {} by user {} is starting", jobId, userId);
        JobModel job = mongodbRepository.getJobById(jobId);

        //Dev path
        Dataset<Row> dataset = read(String.format("%s/%s", configModel.rawFileRoot(), job.rawInputDirectory()));

        //Prints the dataset in tabular format
        //dataset.show();

        List<ColumnModel> columns = new ArrayList<>();

        for (StructField field : dataset.schema().fields()) {
            String columnName = field.name();
            String columnType = field.dataType().typeName();
            List<String> range = new ArrayList<>();

            if (columnType.equals("string")) {  // saving categorical range
                range = dataset.select(columnName).distinct().collectAsList().stream().map(n -> (String) n.get(0)).map(n -> n==null? "null" : n).collect(Collectors.toList());
            } else {    // saving numeric range
                Row minMax = dataset.agg(min(columnName), max(columnName)).head();
                System.out.println(minMax.get(0));
                System.out.println(minMax.get(1));

                double min = Double.parseDouble(minMax.get(0).toString());
                double max = Double.parseDouble(minMax.get(1).toString());

                range.add(Double.toString(min));
                range.add(Double.toString(max));
            }

            ColumnModel column = ImmutableColumnModel.builder()
                    .name(columnName)
                    .type(columnType)
                    .range(range)
                    .build();

            columns.add(column);
        }

        SchemaModel schema = ImmutableSchemaModel.builder()
            .datasetName(String.format("%s/%s", configModel.rawFileRoot(), job.rawInputDirectory()))
            .schema(columns)
            .build();

        ObjectMapper mapper = new ObjectMapper();
        String jsonSchema = mapper.writeValueAsString(schema);

        uploadSchemaToS3(job, jsonSchema);
    }

    /**
     * Uploads the schema in json format to the raw file of the user directory in s3
     * @param job that own the data file the schema is based on
     * @param jsonSchema the schema json in string format
     */
    private void uploadSchemaToS3(JobModel job, String jsonSchema) {
        AWSCredentials credentials = new BasicAWSCredentials(
                configModel.accessKeyId(),
                configModel.secretAccessKey()
        );

        String bucketName = configModel.appName();
        String fileObjKeyName = String.format("%s/%s/raw", job.userId(), job._id());
        String fileName = "schema.json";

        try {
            AmazonS3 s3Client = AmazonS3ClientBuilder
                    .standard()
                    .withCredentials(new AWSStaticCredentialsProvider(credentials))
                    .withRegion(Regions.EU_WEST_2)
                    .build();

            s3Client.putObject(bucketName, fileObjKeyName + "/" + fileName, jsonSchema);
        } catch (SdkClientException e) {
            e.printStackTrace();
        }
    }
}
