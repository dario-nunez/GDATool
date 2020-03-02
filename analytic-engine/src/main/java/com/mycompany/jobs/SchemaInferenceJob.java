package com.mycompany.jobs;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.ColumnModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import com.mycompany.models.SchemaModel;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.StructField;
import org.slf4j.LoggerFactory;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

public class SchemaInferenceJob extends Job {
    public SchemaInferenceJob(SparkSession sparkSession, ConfigModel configModel,
                              MongodbRepository mongodbRepository, ElasticsearchRepository elasticsearchRepository) {
        super(sparkSession, configModel, mongodbRepository, elasticsearchRepository);
        logger = LoggerFactory.getLogger(SchemaInferenceJob.class);
    }

    @Override
    public void run(String userId, String jobId) throws IOException, UnirestException {
        JobModel jobModel = mongodbRepository.getJobById(jobId);

        // AWS version
        Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), jobModel.rawInputDirectory));

        // Fix the names of the columns in the dataset to eliminate forbidden characters
        dataset = HelperFunctions.getValidDataset(dataset).cache();
        // Cast all numeric columns to doubles
        dataset = HelperFunctions.simplifyTypes(dataset);

        // No AWS version
        //Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), "zikaVirusReportedCases.csv"));

        String jsonSchema = getJsonSchema(dataset, jobModel);

        // Save the SchemaModel to the user's s3 bucket
        saveSchemaToS3(jobModel, jsonSchema);
    }

    public String getJsonSchema(Dataset<Row> dataset, JobModel jobModel) throws JsonProcessingException {
        if (dataset.isEmpty()) {
            return "";
        }

        List<ColumnModel> columns = new ArrayList<>();

        // For every column create a ColumnModel
        for (StructField field : dataset.schema().fields()) {
            String columnName = field.name();
            String columnType = field.dataType().typeName();
            List<String> range = new ArrayList<>();

            if (columnType.equals("string")) {  // saving categorical range (String)
                range = dataset.select(columnName).distinct().collectAsList().stream().map(n -> (String) n.get(0)).map(n -> n==null? "null" : n).collect(Collectors.toList());
            } else {    // saving numeric range (Double)
                Row minMax = dataset.agg(min(columnName), max(columnName)).head();
                System.out.println(minMax.get(0));
                System.out.println(minMax.get(1));

                double min = Double.parseDouble(minMax.get(0).toString());
                double max = Double.parseDouble(minMax.get(1).toString());

                range.add(Double.toString(min));
                range.add(Double.toString(max));
            }

            ColumnModel column = new ColumnModel(columnName, columnType, range);
            columns.add(column);
        }

        // Use the list of all ColumnModels to create a SchemaModel object
        SchemaModel schema = new SchemaModel(String.format("%s/%s", configModel.bucketRoot(), jobModel.rawInputDirectory), columns);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(schema);
    }

    /**
     * Uploads the schema in json format to the raw file of the user directory in s3
     * @param job that own the data file the schema is based on
     * @param jsonSchema the schema json in string format
     */
    public void saveSchemaToS3(JobModel job, String jsonSchema) {
        AWSCredentials awsCredentials = new BasicAWSCredentials(
                configModel.awsAccessKeyIdEnvVariable(),
                configModel.awsSecretAccessKeyEnvVariable()
        );

        String bucketName = configModel.appName();
        String fileObjKeyName = String.format("%s/%s/raw", job.userId, job._id);
        String fileName = "schema.json";

        try {
            // Instantiating the s3 client
            AmazonS3Client s3Client = new AmazonS3Client(awsCredentials);
            s3Client.setRegion(Region.getRegion(Regions.EU_WEST_1));

            // Creating an input stream to contain the json schema bytes and metadata about the stream
            InputStream inputStream = new ByteArrayInputStream(jsonSchema.getBytes());
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType("plain/text");
            objectMetadata.setContentLength(jsonSchema.getBytes().length);

            // Saving the json string to s3
            s3Client.putObject(bucketName, fileObjKeyName + "/" + fileName, inputStream, objectMetadata);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

