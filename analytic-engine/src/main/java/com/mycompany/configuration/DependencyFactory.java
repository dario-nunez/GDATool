package com.mycompany.configuration;

import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.HttpService;
import com.mycompany.services.MongodbRepository;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableConfigModel;

import org.apache.http.HttpHost;
import org.apache.spark.SparkConf;
import org.apache.spark.sql.SparkSession;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

/**
 * Create all the dependencies necessary to run the jobs. Used for dependency injection in the test environment.
 */
public class DependencyFactory {
    private Environment env;
    private final Logger logger = LoggerFactory.getLogger("Data Engine");
    private HttpService httpService;
    private ConfigModel configModel;

    /**
     * Instantiate the environment and a Config Model.
     * @param env Environment created by main using console arguments.
     */
    public DependencyFactory(Environment env) throws IOException {
        this.env = env;
        this.configModel = buildConfigModel();
    }

    /**
     * Build a ConfigModel immutable object by using the values from the Properties Manager.
     * The Config Model holds all the parameters for the dependencies used by the jobs.
     * @return The built Config Model object.
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
     * Create and return an instance of HttpService if none exists.
     * @return HttpService object.
     */
    private HttpService getHttpService() {
        if (httpService == null) {
            this.httpService = new HttpService();
        }
        return httpService;
    }

    /**
     * Create and return an Apache Spark session created using the properties in the Config Model.
     * This current setup is designed to run on the IDE and on a local Docker container.
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
     * Create and return an instance of Mongodb Repository. Used to interact with the mongodb-service
     * @return A Mongodb Repository object.
     */
    public MongodbRepository getMongodbRepository() {
        return new MongodbRepository(configModel, getHttpService());
    }

    /**
     * Create and return an instance of Elasticsearch Repository. Used to interact with the elasticsearch-service
     * @return A Elasticsearch Repository object.
     */
    public ElasticsearchRepository getElasticsearchRepository() {
        return new ElasticsearchRepository(configModel, getHttpService());
    }

    /**
     * Create and return a Rest High Level Client object using the elasticsearch configuration in the ConfigModel.
     * This client is used to interact with Elasticsearch clusters via Spark functions
     * @return RestHighLevelClient object.
     */
    public RestHighLevelClient getRestHighLevelClient() {
        return new RestHighLevelClient(RestClient.builder(new HttpHost(
                configModel.elasticsearchUrl(),
                Integer.parseInt(configModel.elasticsearchPort()),
                "http")));
    }
}

