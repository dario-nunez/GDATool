package com.mycompany.jobs;

import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import com.mycompany.models.ColumnModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import com.mycompany.models.SchemaModel;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.StructField;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

/**
 * The Schema Inference job generates a schema.json file for a given JobModel. It uses the JobModel's metadata to fetch
 * the correct dataset from AWS. It cleans it and generates a Schema object from it. Lastly, it saves this object as the
 * file schema.json in the jobs's user S3 bucket.
 *
 * The schema.json file is a compressed representation of the original dataset (OD). It contains the same range of
 * values as the OD but it does not store what values belong to each record. It also stores metadata about the dataset
 * and each of its columns.
 */
public class SchemaInferenceJob extends Job {
    public SchemaInferenceJob(SparkSession sparkSession, ConfigModel configModel,
                              MongodbRepository mongodbRepository, ElasticsearchRepository elasticsearchRepository) {
        super(sparkSession, configModel, mongodbRepository, elasticsearchRepository);
        logger = LoggerFactory.getLogger(SchemaInferenceJob.class);
    }

    /**
     * Run the Schema Inference job. It reads the dataset, cleans, generates a schema.json file from it and stores this
     * in the user's S3 bucket in AWS.
     * @param userId: ID of the user the job belongs to.
     * @param jobId: ID of the job triggered.
     */
    @Override
    public void run(String userId, String jobId) throws IOException, UnirestException {
        // Read: Get Mongodb entities and dataset from AWS
        JobModel jobModel = mongodbRepository.getJobById(jobId);
        Dataset<Row> dataset = read(String.format("%s/%s", configModel.bucketRoot(), jobModel.rawInputDirectory));

        // Clean: Clean the dataset
        dataset = HelperFunctions.getValidDataset(dataset).cache();
        dataset = HelperFunctions.simplifyTypes(dataset);

        // Generate schema object from the dataset
        String jsonSchema = getJsonSchema(dataset, jobModel);

        // Save schema to AWS
        saveSchemaToS3(jobModel, jsonSchema);
    }

    /**
     * Generate a Schema object from a dataset. A SchemaModel is metadata object that contains a List of ColumnModels.
     * It stores a dataset partially by encapsulating values in ranges. Numeric columns are reduced to a max & min
     * value and text columns are reduced to collections of unique entries. The size of the schema compared to the size
     * of the original dataset is considerably less.
     * @param dataset: the raw dataset.
     * @param jobModel: the job which the dataset corresponds to.
     * @return a String representation of a SchemaModel object.
     */
    public String getJsonSchema(Dataset<Row> dataset, JobModel jobModel) throws JsonProcessingException {
        // Return an empty String if the dataset contains no data rows.
        if (dataset.isEmpty()) {
            return "";
        }

        List<ColumnModel> columns = new ArrayList<>();

        // For every column, create a ColumnModel
        for (StructField field : dataset.schema().fields()) {
            String columnName = field.name();
            String columnType = field.dataType().typeName();
            List<String> range = new ArrayList<>();

            if (columnType.equals("string")) {
                // Saving categorical range (String).
                range = dataset.select(columnName).distinct().collectAsList().stream().map(n -> (String) n.get(0)).map(n -> n==null? "null" : n).collect(Collectors.toList());
            } else {
                // Saving numeric range (Double).
                Row minMax = dataset.agg(min(columnName), max(columnName)).head();

                double min = Double.parseDouble(minMax.get(0).toString());
                double max = Double.parseDouble(minMax.get(1).toString());

                range.add(Double.toString(min));
                range.add(Double.toString(max));
            }

            ColumnModel column = new ColumnModel(columnName, columnType, range);
            columns.add(column);
        }

        // Use the list of all ColumnModels to create a SchemaModel object.
        SchemaModel schema = new SchemaModel(String.format("%s/%s", configModel.bucketRoot(), jobModel.rawInputDirectory), columns);
        ObjectMapper mapper = new ObjectMapper();

        // Return the SchemaModel as a String.
        return mapper.writeValueAsString(schema);
    }

    /**
     * Upload the schema to the raw file of the user directory in S3
     * @param job: job that owns the data file the schema is based on.
     * @param jsonSchema: the SchemaModel json in string format.
     */
    public void saveSchemaToS3(JobModel job, String jsonSchema) {
        // Set AWS credentials
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

