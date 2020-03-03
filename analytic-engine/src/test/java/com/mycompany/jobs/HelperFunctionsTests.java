package com.mycompany.jobs;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.ConfigModel;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import org.apache.commons.io.FileUtils;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.apache.spark.sql.functions.col;
import static org.junit.Assert.assertEquals;

/**
 * This file tests the HelperFunction methods.
 */
public class HelperFunctionsTests {
    private final String c = HelperFunctions.replaceCharacter;
    private Job job;
    private Dataset<Row> inputDataset;
    private ConfigModel configModel;
    private ClassLoader classLoader;

    @Mock
    MongodbRepository mongodbRepositoryMock;
    @Mock
    ElasticsearchRepository elasticsearchRepositoryMock;

     public HelperFunctionsTests() throws IOException {
         classLoader = getClass().getClassLoader();
         MockitoAnnotations.initMocks(this);
         DependencyFactory dependencyFactory = new TestDependencyFactory();
         configModel = dependencyFactory.getConfigModel();
         SparkSession sparkSession = dependencyFactory.getSparkSession();
         job = new TestJob(sparkSession, configModel, mongodbRepositoryMock, elasticsearchRepositoryMock);
         inputDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "testDatasets/helperFunctionsDS.csv"));
     }

    @Test
    public void getValidColumnName_valid_notChanged() {
        String validName = HelperFunctions.getValidColumnName("city");
        assertEquals(validName, "city");
    }

    @Test
    public void getValidColumnName_comma_isChanged() {
        String validName = HelperFunctions.getValidColumnName("ci,ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_semicolon_isChanged() {
        String validName = HelperFunctions.getValidColumnName("ci;ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_curlyBraceOpen_isChanged() {
        String validName = HelperFunctions.getValidColumnName("ci{ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_curlyBraceClosed_isChanged() {
        String validName = HelperFunctions.getValidColumnName("ci}ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_bracketOpen_isChanged() {
        String validName = HelperFunctions.getValidColumnName("ci(ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_bracketClose_isChanged() {
        String validName = HelperFunctions.getValidColumnName("ci)ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_slashN_isChanged() {
        String validName = HelperFunctions.getValidColumnName("ci\nty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_Tequals_isChanged() {
        String validName = HelperFunctions.getValidColumnName("cit=ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void getValidColumnName_allIntercalatedInvalid_isChanged() {
        String validName = HelperFunctions.getValidColumnName("a,a;a{a}a(a)a\nat=a");
        String formattedInput = "a%sa%sa%sa%sa%sa%sa%sa%sa";
        assertEquals(validName, formattedInput.replace("%s", c));
    }

    @Test
    public void getValidColumnName_allSequentialInvalid_isChanged() {
        String validName = HelperFunctions.getValidColumnName("a,;{}()\nt=a");
        String formattedInput = "a%s%s%s%s%s%s%s%sa";
        assertEquals(validName, formattedInput.replace("%s", c));
    }

    @Test
    public void getValidColumnName_slashSpace_isChanged() {
        String validName = HelperFunctions.getValidColumnName("Country / territory0");
        assertEquals(validName, "Country___territory0");
    }

    /**
     * Should convert the list of strings into a Scala seq of strings. In the test, the assertion is comparing strings
     * instead of the actual collections because the only way to a Seq to a List in Java is exactly the method being
     * tested so an alternative approach that yields comparable results is used - toString methods (:
     */
    @Test
    public void convertListToSeqString_converted() {
        List<String> stringList = new ArrayList<String>() {
            {
                add("a");
                add("b");
                add("c");
            }
        };

        String actualSeqString = HelperFunctions.convertListToSeqString(stringList).mkString();
        String expectedString = "";

        for (String e : stringList) {
            expectedString = expectedString + e;
        }

        assertEquals(expectedString, actualSeqString);
    }

    /**
     * Should return the original dataset but with any invalid column names changed to valid ones.
     */
    @Test
    public void getValidDataset_populatedDataset_returnDatasetWithAllValidColumnNames() {
        Dataset<Row> actualDataset = HelperFunctions.getValidDataset(inputDataset).cache();
        Dataset<Row> expectedDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "testDatasets/helperFunctionsDSValidColumnNames.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return an empty dataset but with any invalid column names changed to valid ones.
     */
    @Test
    public void getValidDataset_emptyDataset_returnEmptyDatasetWithAllValidColumnNames() {
        Dataset<Row> emptyDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "testDatasets/helperFunctionsDSEmpty.csv"));
        Dataset<Row> actualDataset = HelperFunctions.getValidDataset(emptyDataset).cache();
        Dataset<Row> expectedDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "testDatasets/helperFunctionsDSEmptyValidColumnNames.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    /**
     * Should return the original dataset but with any invalid column names that is specified, changed to a valid one.
     */
    @Test
    public void stringifyFeatureColumns_populatedDataset_returnDatasetWithValidSpecifiedColumnNames() {
        List<String> featureColumns = new ArrayList<String>() {
            {
                add("Measure Names");
                add("Month of Date");
                add("Year of Date");
            }
        };

        Dataset<Row> actualDataset = HelperFunctions.stringifyFeatureColumns(inputDataset, featureColumns).cache();
        Dataset<Row> expectedDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "testDatasets/helperFunctionsDS.csv"));
        expectedDataset = expectedDataset.withColumn("Year of Date", col("Year of Date").cast("String"));

        assertEquals(expectedDataset.schema(), actualDataset.schema());
    }

    /**
     * Should return the original dataset but with all its column types as either Double (numeric) or String (text/
     * categorical/string).
     */
    @Test
    public void simplifyTypes_populatedDataset_returnDatasetWithAllTypesAsStringOrDouble() throws IOException {
        Dataset<Row> actualDataset = HelperFunctions.simplifyTypes(inputDataset).cache();

        String actualSchema = actualDataset.schema().toString();
        File schemaFile = new File(Objects.requireNonNull(classLoader.getResource("testDatasets/helperFunctionsDSSimplifiedTypesSchema.txt")).getFile());
        String expectedSchema = FileUtils.readFileToString(schemaFile, StandardCharsets.UTF_8);

        assertEquals(expectedSchema, actualSchema);
    }

    /**
     * Should return an empty dataset with its original inferred types (string for an empty column as default).
     */
    @Test
    public void simplifyTypes_emptyDataset_returnEmptyDatasetWithAllColumnsTypedAsString() throws IOException {
        Dataset<Row> emptyDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "testDatasets/helperFunctionsDSEmpty.csv"));
        Dataset<Row> actualDataset = HelperFunctions.simplifyTypes(emptyDataset).cache();

        String actualSchema = actualDataset.schema().toString();
        File schemaFile = new File(Objects.requireNonNull(classLoader.getResource("testDatasets/helperFunctionsDSSimplifiedTypesSchemaEmptyDataset.txt")).getFile());
        String expectedSchema = FileUtils.readFileToString(schemaFile, StandardCharsets.UTF_8);

        assertEquals(expectedSchema, actualSchema);
    }

    /**
     * A simple Mock Job class used for reading test datasets.
     */
    static class TestJob extends Job {
        TestJob(SparkSession sparkSession, ConfigModel configModel, MongodbRepository mongodbRepository, ElasticsearchRepository elasticsearchRepository) {
            super(sparkSession, configModel, mongodbRepository, elasticsearchRepository);
            logger = LoggerFactory.getLogger(SchemaInferenceJob.class);
        }

        @Override
        public void run(String jobId, String userId) { }
    }
}
