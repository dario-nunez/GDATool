package com.mycompany.configuration;

import com.google.inject.AbstractModule;
import com.mycompany.jobs.DefaultJob;
import com.mycompany.jobs.UserDefinedFunctionsFactory;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableConfigModel;
import com.mycompany.services.HttpService;
import com.mycompany.services.MongodbRepository;
import org.apache.http.HttpHost;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.spark.SparkConf;
import org.apache.spark.sql.SparkSession;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

public class Module extends AbstractModule {

    private final Environment env;
    private final ConfigModel configModel;
    private final Logger logger = LoggerFactory.getLogger("Data Engine");
    public String jobId;

    public Module(Environment env, String jobId) {
        this.env = env;
        this.configModel = buildConfigModel();
        this.jobId = jobId;
    }

    @Override
    protected void configure() {
        bind(PropertiesManager.class).toInstance(new PropertiesManager());
        bind(ConfigModel.class).toInstance(configModel);
        bind(DefaultJob.class);
        bind(MongodbRepository.class);
        bind(SparkSession.class).toProvider(() -> {
            // Create the spark session
            if (env == Environment.LOCAL  || env == Environment.DOCKER) {
                SparkConf conf = new SparkConf()
                        .setAppName(configModel.appName())
                        .set("fs.s3a.access.key", configModel.accessKeyId())
                        .set("fs.s3a.secret.key", configModel.secretAccessKey())
                        .set("spark.es.nodes.wan.only","true");

                if (configModel.master() != null) {
                    conf = conf.setMaster(configModel.master());
                }
                logger.info("Running with {} configuration", env);
                return SparkSession.builder().config(conf).getOrCreate();
            }
            logger.info("Running with {} configuration", env);
            return SparkSession.builder().getOrCreate();
        });
        bind(RestHighLevelClient.class).toProvider(() ->
                new RestHighLevelClient(RestClient.builder(new HttpHost(configModel.elasticsearchUrl(),
                        configModel.elasticsearchPort(), "http"))));
        bind(MongodbRepository.class);
        bind(HttpClient.class).toInstance(HttpClientBuilder.create().build());
        bind(HttpFactory.class);
        bind(UserDefinedFunctionsFactory.class);
        bind(HttpService.class).toProvider(() -> new HttpService(configModel, jobId));
    }

    protected ConfigModel buildConfigModel() {
        PropertiesManager propertiesManager = new PropertiesManager();
        Properties prop = new Properties();
        try {
            prop = propertiesManager.loadEnvironment(env);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ImmutableConfigModel.builder()
                .accessKeyId(System.getenv(prop.getProperty("awsAccessKeyIdEnvVariable")))
                .appName("appName")
                .elasticsearchPort(Integer.parseInt(prop.getProperty("elasticsearchPort", "9200")))
                .elasticsearchUrl(prop.getProperty("elasticsearchUrl", "localhost"))
                .master(prop.getProperty("master"))
                .rawFileRoot(prop.getProperty("rawFileRoot"))
                .secretAccessKey(System.getenv(prop.getProperty("awsSecretAccessKeyEnvVariable")))
                .stagingFolder(prop.getProperty("stagingFolder"))
                .mongodbRootUrl(prop.getProperty("mongodbRootUrl"))
                .elasticsearchServiceRootUrl(prop.getProperty("elasticsearchServiceRootUrl"))
                .build();
    }
}
