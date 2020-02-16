//package com.mycompany.jobs;
//
//import com.google.inject.Guice;
//import com.google.inject.Injector;
//import com.mycompany.TestModule;
//import com.mycompany.models.AggregationModel;
//import com.mycompany.models.ConfigModel;
//import com.mycompany.models.ImmutableAggregationModel;
//import com.mycompany.services.bi.BiRepository;
//import com.mycompany.services.MongodbRepository;
//import org.apache.spark.sql.SparkSession;
//import org.junit.Before;
//import org.junit.Test;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.time.LocalDateTime;
//import java.time.ZoneOffset;
//
//import static org.junit.Assert.assertEquals;
//
//public class JobTest {
//
//    @Mock
//    SparkSession sparkSessionMock;
//    @Mock
//    MongodbRepository mongodbRepositoryMock;
//    @Mock
//    BiRepository biRepositoryMock;
//    @Mock
//    UserDefinedFunctionsFactory userDefinedFunctionsFactoryMock;
//
//    private ConfigModel configModel;
//
//    @Before
//    public void setup() {
//        MockitoAnnotations.initMocks(this);
//        Injector injector = Guice.createInjector(new TestModule(""));
//        configModel = injector.getInstance(ConfigModel.class);
//    }
//
//    @Test
//    public void getElasticIndexName() {
//        Job job = new TestJob(sparkSessionMock, configModel, mongodbRepositoryMock, biRepositoryMock, userDefinedFunctionsFactoryMock);
//        AggregationModel aggregationModel = ImmutableAggregationModel.builder()._id("aggregationModelId")
//                .name("gb_county").metricColumn("price").build();
//
//        long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);
//
//        String esIndexName = job.getElasticIndexName(aggregationModel, dateEpoch);
//        assertEquals(String.format("%s_%d", aggregationModel._id(), dateEpoch), esIndexName);
//    }
//
//    class TestJob extends Job {
//
//        TestJob(SparkSession sparkSession, ConfigModel configModel, MongodbRepository mongodbRepository, BiRepository biRepository,
//                UserDefinedFunctionsFactory userDefinedFunctionsFactory) {
//            super(sparkSession, configModel, mongodbRepository, biRepository, userDefinedFunctionsFactory);
//        }
//
//        @Override
//        public void run(String jobId, String userId) {
//
//        }
//    }
//}