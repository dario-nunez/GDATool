package com.mycompany.jobs;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.*;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import org.apache.commons.io.FileUtils;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import static org.junit.Assert.assertEquals;

public class SchemaInferenceJobTests {
    private Dataset<Row> inputDataset;
    private SchemaInferenceJob schemaInferenceJob;
    private ClassLoader classLoader;
    private JobModel jobModel;

    @Mock
    MongodbRepository mongodbRepositoryMock;
    @Mock
    ElasticsearchRepository elasticsearchRepositoryMock;

    public SchemaInferenceJobTests() throws IOException, UnirestException {
        MockitoAnnotations.initMocks(this);
        ObjectMapper objectMapper = new ObjectMapper();
        classLoader = getClass().getClassLoader();

        File jobFile = new File(Objects.requireNonNull(classLoader.getResource("testJob.json")).getFile());
        String jobFileContents = FileUtils.readFileToString(jobFile, StandardCharsets.UTF_8);
        jobModel = objectMapper.readValue(jobFileContents, new TypeReference<JobModel>(){});

        when(mongodbRepositoryMock.getJobById(anyString())).thenReturn(jobModel);

        DependencyFactory dependencyFactory = new TestDependencyFactory();
        ConfigModel configModel = dependencyFactory.getConfigModel();
        SparkSession sparkSession = dependencyFactory.getSparkSession();
        schemaInferenceJob = new SchemaInferenceJob(sparkSession, configModel, mongodbRepositoryMock,
                elasticsearchRepositoryMock);
        inputDataset = schemaInferenceJob.read(String.format("%s/%s", configModel.bucketRoot(), "ukPropertiesDs/schemaInferenceJobDS.csv"));
    }

    /**
     * city and price are selected
     */
    @Test
    public void getJsonSchema() throws IOException, UnirestException {
        String actualSchema = schemaInferenceJob.getJsonSchema(inputDataset, jobModel);

        File schemaFile = new File(Objects.requireNonNull(classLoader.getResource("ukPropertiesDs/schemaInferenceJobJSONSchema.json")).getFile());
        String expectedSchema = FileUtils.readFileToString(schemaFile, StandardCharsets.UTF_8);

        assertEquals(expectedSchema, actualSchema);
    }
}
