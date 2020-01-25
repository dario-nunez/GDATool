package com.mycompany.jobs;

import com.google.inject.Inject;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.JobModel;
import com.mycompany.services.bi.BiRepository;
import com.mycompany.services.mongodb.MongodbRepository;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.output.FileWriterWithEncoding;
import org.apache.spark.sql.*;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructField;
import org.apache.spark.util.ShutdownHookManager;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectWriter;
import org.elasticsearch.action.admin.indices.alias.IndicesAliasesRequest;
import org.elasticsearch.action.admin.indices.alias.IndicesAliasesRequest.AliasActions;
import org.elasticsearch.action.admin.indices.alias.get.GetAliasesRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.get.GetIndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.spark.sql.api.java.JavaEsSparkSQL;
import org.joda.time.field.FieldUtils;
import org.slf4j.LoggerFactory;
import scala.collection.Seq;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

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

        HashMap<String, String> schema = new HashMap<>();

        for (StructField field : dataset.schema().fields()) {
            schema.put(field.name(), field.dataType().typeName());
        }

        ObjectWriter objectWriter = new ObjectMapper().writer().withDefaultPrettyPrinter();

        List OGDataset = dataset.collectAsList();
        FileUtils.writeStringToFile(new File(String.format("%s/%s/%s/raw/ogdataset.txt", configModel.rawFileRoot(), userId, jobId)), OGDataset.toString());

        String jsonSchema = objectWriter.writeValueAsString(schema);
        FileUtils.writeStringToFile(new File(String.format("%s/%s/%s/raw/schema.json", configModel.rawFileRoot(), userId, jobId)), jsonSchema);
        System.out.println(jsonSchema);
    }
}
