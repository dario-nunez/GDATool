package com.mycompany.configuration;

import com.mycompany.jobs.UserDefinedFunctionsFactory;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableConfigModel;
import org.apache.http.HttpHost;
import org.apache.spark.SparkConf;
import org.apache.spark.sql.SparkSession;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.HttpService;
import com.mycompany.services.MongodbRepository;

import java.io.IOException;
import java.util.Properties;

public class DependencyFactory {
    private Environment env;
    private String jobId;
    private final Logger logger = LoggerFactory.getLogger("Data Engine");
    private HttpService httpService;
    private ConfigModel configModel;

    /**
     * Instantiates the environment, jobId variable and builds the Config Model.
     * @param env Environment created by main using console arguments.
     * @param jobId Passed as a console argument.
     * @throws IOException
     */
    public DependencyFactory(Environment env, String jobId) throws IOException {
        this.env = env;
        this.jobId = jobId;
        this.configModel = buildConfigModel();
    }

    /**
     * Builds a ConfigModel immutable object by using the immutable object builder and the values from the Properties
     * object.
     * @return The built ConfigModel object.
     * @throws IOException
     */
    public ConfigModel buildConfigModel() throws IOException {
        PropertiesManager propertiesManager = new PropertiesManager();
        Properties properties = propertiesManager.loadEnvironment(env);

        return ImmutableConfigModel.builder()
                .awsAccessKeyIdEnvVariable(properties.getProperty("awsAccessKeyIdEnvVariable"))
                .awsSecretAccessKeyEnvVariable(properties.getProperty("awsSecretAccessKeyEnvVariable"))
                .appName(properties.getProperty("appName"))
                .bucketRoot(properties.getProperty("bucketRoot"))
                .stagingFolder(properties.getProperty("stagingFolder"))
                .elasticsearchServiceUrl(properties.getProperty("elasticsearchServiceUrl"))
                .elasticsearchPort(properties.getProperty("elasticsearchPort"))
                .master(properties.getProperty("master"))
                .mongodbServiceUrl(properties.getProperty("mongodbServiceUrl"))
                .elasticsearchUrl(properties.getProperty("elasticsearchUrl"))
                .build();
    }

    /**
     * A getter for the ConfigModel object.
     * @return The ConfigModel object.
     */
    public ConfigModel getConfigModel() {
        return configModel;
    }

    /**
     * Creates and returns an instance of HttpService if none exist.
     * @return HttpService object.
     */
    private HttpService getHttpService() {
        if (httpService == null) {
            this.httpService = new HttpService(configModel, jobId);
        }
        return httpService;
    }

    /**
     * Create and return an Apache Spark session created using the properties in the ConfigModel.
     * @return The SparkSession object.
     */
    public SparkSession getSparkSession(){
        if (env == Environment.LOCAL || env == Environment.DOCKER || env == Environment.LOCDEV) {
            SparkConf sparkConf = new SparkConf()
                    .setAppName(configModel.appName())
                    .set("spark.hadoop.fs.s3a.access.key", configModel.awsAccessKeyIdEnvVariable())
                    .set("spark.hadoop.fs.s3a.secret.key", configModel.awsSecretAccessKeyEnvVariable())
                    .set("spark.es.nodes.wan.only","true")
                    .set("spark.hadoop.fs.s3a.endpoint", "s3.eu-west-1.amazonaws.com")
                    .set("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")  // ES props bellow
                    .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
                    .set("spark.es.index.auto.create", "true")
                    .set("spark.es.nodes", configModel.elasticsearchUrl())
                    .set("spark.es.port", "9200")
                    .set("spark.es.net.http.auth.user","")
                    .set("spark.es.net.http.auth.pass", "");

            if (configModel.master() != null) {
                sparkConf = sparkConf.setMaster(configModel.master());
            }

            logger.info("Running with {} configuration", env);
            return SparkSession.builder().config(sparkConf).getOrCreate();
        }

        logger.info("Running with {} configuration", env);
        return SparkSession.builder().getOrCreate();
    }

    /**
     * Creates and returns an instance of MongodbRepository.
     * @return A MongodbRepository object.
     */
    public MongodbRepository getMongodbRepository() {
        return new MongodbRepository(configModel, getHttpService());
    }

    /**
     * Creates and returns an instance of ElasticsearchRepository.
     * @return A ElasticsearchRepository object.
     */
    public ElasticsearchRepository getElasticsearchRepository() {
        return new ElasticsearchRepository(configModel, getHttpService());
    }

    /**
     * Creates and returns a RestHighLevelClient object using the elasticsearch configuration fields in the ConfigModel.
     * @return RestHighLevelClient object.
     */
    public RestHighLevelClient getRestHighLevelClient() {
        return new RestHighLevelClient(RestClient.builder(new HttpHost(
                configModel.elasticsearchUrl(),
                Integer.parseInt(configModel.elasticsearchPort()),
                "http")));
    }

    /**
     * Creates and returns a UserDefinedFunctionsFactory object.
     * @return a UserDefinedFunctionsFactory object.
     */
    public UserDefinedFunctionsFactory getUserDefinedFunctionsFactory() {
        return new UserDefinedFunctionsFactory();
    }
}

