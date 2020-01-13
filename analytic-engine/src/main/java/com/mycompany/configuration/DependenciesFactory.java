package com.mycompany.configuration;

import com.mycompany.jobs.UserDefinedFunctionsFactory;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableConfigModel;
import com.mycompany.services.HttpService;
import com.mycompany.services.bi.BiRepository;
import com.mycompany.services.mongodb.MongodbRepository;
import org.apache.http.HttpHost;
import org.apache.spark.SparkConf;
import org.apache.spark.sql.SparkSession;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

public class DependenciesFactory implements Log {
    private final Environment env;
    private final ConfigModel configModel;
    private final Logger logger = LoggerFactory.getLogger("Data Engine");
    private HttpService httpService;
    private String jobId;

    public DependenciesFactory(Environment env, String jobId) {
        this.env = env;
        this.configModel = configModel();
        this.jobId = jobId;
    }

    public MongodbRepository mongodbRepository() {
        return new MongodbRepository(configModel(), httpService());
    }

    public BiRepository biRepository() {
        return new BiRepository(configModel(), httpService());
    }

    public UserDefinedFunctionsFactory userDefinedFunctionsFactory() {
        return new UserDefinedFunctionsFactory();
    }

    public RestHighLevelClient restHighLevelClient() {
        return new RestHighLevelClient(RestClient.builder(new HttpHost(configModel.elasticsearchUrl(),
                configModel.elasticsearchPort(), "http")));
    }

    public SparkSession sparkSession() {
        if (env == Environment.LOCAL || env == Environment.DEV) {
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
    }

    public ConfigModel configModel() {
        if (configModel != null) {
            return configModel;
        }
        PropertiesManager propertiesManager = new PropertiesManager();
        Properties prop = new Properties();
        try {
            prop = propertiesManager.loadEnvironment(env);

        } catch (IOException e) {
            e.printStackTrace();
        }

        logger().info(prop.getProperty("awsSecretAccessKeyEnvVariable"),
                System.getenv(prop.getProperty("awsSecretAccessKeyEnvVariable")),
                prop.getProperty("awsAccessKeyIdEnvVariable"),
                System.getenv(prop.getProperty("awsAccessKeyIdEnvVariable")));

        return ImmutableConfigModel.builder()
                .accessKeyId(prop.getProperty("awsAccessKeyIdEnvVariable"))
                .appName("appName")
                .elasticsearchPort(Integer.parseInt(prop.getProperty("elasticsearchPort", "9200")))
                .elasticsearchUrl(prop.getProperty("elasticsearchUrl", "localhost"))
                .master(prop.getProperty("master"))
                .rawFilePath(prop.getProperty("rawFilePath"))
                .secretAccessKey(prop.getProperty("awsSecretAccessKeyEnvVariable"))
                .stagingFileName(prop.getProperty("stagingFileName"))
                .stagingFolder(prop.getProperty("stagingFolder"))
                .mongodbRootUrl(prop.getProperty("mongodbRootUrl"))
                .elasticsearchServiceRootUrl(prop.getProperty("elasticsearchServiceRootUrl"))
                .build();
    }

    public HttpService httpService() {
        if (httpService == null) {
            httpService = new HttpService(configModel, jobId);
        }
        return httpService;
    }
}
