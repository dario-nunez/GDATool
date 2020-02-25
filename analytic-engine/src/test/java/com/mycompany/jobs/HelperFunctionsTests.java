package com.mycompany.jobs;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.ConfigModel;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.apache.spark.sql.functions.col;
import static org.junit.Assert.assertEquals;

public class HelperFunctionsTests {
    private final String c = HelperFunctions.replaceCharacter;
    private Job job;
    private Dataset<Row> inputDataset;
    ConfigModel configModel;
    @Mock
    MongodbRepository mongodbRepositoryMock;
    @Mock
    ElasticsearchRepository elasticsearchRepositoryMock;
    @Mock
    UserDefinedFunctionsFactory userDefinedFunctionsFactoryMock;

     public HelperFunctionsTests() throws IOException {
         MockitoAnnotations.initMocks(this);
         DependencyFactory dependencyFactory = new TestDependencyFactory();
         configModel = dependencyFactory.getConfigModel();
         SparkSession sparkSession = dependencyFactory.getSparkSession();
         job = new TestJob(sparkSession, configModel, mongodbRepositoryMock, elasticsearchRepositoryMock, userDefinedFunctionsFactoryMock);

         inputDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "helperFunctionsDS.csv"));
     }

    @Test
    public void validNameIsNotChanged() {
        String validName = HelperFunctions.getValidColumnName("city");
        assertEquals(validName, "city");
    }

    @Test
    public void invalidNameContainingCOMMAIsCanged() {
        String validName = HelperFunctions.getValidColumnName("ci,ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingSEMICOLONIsCanged() {
        String validName = HelperFunctions.getValidColumnName("ci;ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingCURLYBRACEOPENCanged() {
        String validName = HelperFunctions.getValidColumnName("ci{ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingCURLYBRACECLOSEDCanged() {
        String validName = HelperFunctions.getValidColumnName("ci}ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingBRACKETOPENCanged() {
        String validName = HelperFunctions.getValidColumnName("ci(ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingBRACKETCLOSEDCanged() {
        String validName = HelperFunctions.getValidColumnName("ci)ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingSLASHNCanged() {
        String validName = HelperFunctions.getValidColumnName("ci\nty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingTEQUALSCanged() {
        String validName = HelperFunctions.getValidColumnName("cit=ty");
        assertEquals(validName, String.format("ci%sty", c));
    }

    @Test
    public void invalidNameContainingAllInvalidCharactersIntercalatedCanged() {
        String validName = HelperFunctions.getValidColumnName("a,a;a{a}a(a)a\nat=a");
        String formattedInput = "a%sa%sa%sa%sa%sa%sa%sa%sa";
        assertEquals(validName, formattedInput.replace("%s", c));
    }

    @Test
    public void invalidNameContainingAllInvalidCharactersSequentiallyCanged() {
        String validName = HelperFunctions.getValidColumnName("a,;{}()\nt=a");
        String formattedInput = "a%s%s%s%s%s%s%s%sa";
        assertEquals(validName, formattedInput.replace("%s", c));
    }

    @Test
    public void other() {
        String validName = HelperFunctions.getValidColumnName("Country / territory0");
        assertEquals(validName, "Country___territory0");
    }

    /**
     * The comparison is done between the strings resulting from both collections because Scala collection
     * Seq objects can only be created in Java in one way, and that way is being used in the test subject
     * method so an alternative method of getting the data is necessary in the testing method.
     */
    @Test
    public void convertListToSeqString() {
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

    @Test
    public void getValidDataset() {
        Dataset<Row> actualDataset = HelperFunctions.getValidDataset(inputDataset).cache();
        Dataset<Row> expectedDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "helperFunctionsDSValidColumnNames.csv"));

        assertEquals(expectedDataset.collectAsList(), actualDataset.collectAsList());
    }

    @Test
    public void stringifyFeatureColumns() {
        List<String> featureColumns = new ArrayList<String>() {
            {
                add("Measure Names");
                add("Month of Date");
                add("Year of Date");
            }
        };

        Dataset<Row> actualDataset = HelperFunctions.stringifyFeatureColumns(inputDataset, featureColumns).cache();
        Dataset<Row> expectedDataset = job.read(String.format("%s/%s", configModel.bucketRoot(), "helperFunctionsDS.csv"));
        expectedDataset = expectedDataset.withColumn("Year of Date", col("Year of Date").cast("String"));

        assertEquals(expectedDataset.schema(), actualDataset.schema());
    }

    static class TestJob extends Job {
        TestJob(SparkSession sparkSession, ConfigModel configModel, MongodbRepository mongodbRepository, ElasticsearchRepository elasticsearchRepository,
                UserDefinedFunctionsFactory userDefinedFunctionsFactory) {
            super(sparkSession, configModel, mongodbRepository, elasticsearchRepository, userDefinedFunctionsFactory);
            logger = LoggerFactory.getLogger(SchemaInferenceJob.class);
        }

        @Override
        public void run(String jobId, String userId) { }
    }
}
