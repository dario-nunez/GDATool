package com.mycompany.jobs;

import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import com.mycompany.models.OperationEnum;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.apache.spark.sql.Column;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.storage.StorageLevel;

import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

/**
 * A base class of Spark jobs. It contains environment setup variables and common Spark & Elasticsearch functions.
 */
public abstract class Job {
    protected Logger logger;
    protected SparkSession sparkSession;
    protected ConfigModel configModel;
    protected MongodbRepository mongodbRepository;
    protected ElasticsearchRepository elasticsearchRepository;

    public Job(SparkSession sparkSession, ConfigModel configModel, MongodbRepository mongodbRepository,
               ElasticsearchRepository elasticsearchRepository) {
        this.sparkSession = sparkSession;
        this.configModel = configModel;
        this.mongodbRepository = mongodbRepository;
        this.elasticsearchRepository = elasticsearchRepository;
    }

    public abstract void run(String jobId, String userId) throws IOException, UnirestException;

    /**
     * Read a data file in .csv format, inferring its schema and returning it in the Dataset object.
     * @param path: path to the data file.
     * @return Dataset object containing the data in the file along with some metadata.
     */
    Dataset<Row> read(String path) {
        logger.info(String.format("Reading %s", path));
        return sparkSession.read().format("csv")
                .option("inferSchema", true)
                .option("header", "true")
                .load(path)
                .persist(StorageLevel.MEMORY_AND_DISK_SER());
    }

    /**
     * Create and return the name of the elasticsearch index based on the given prefix.
     * @param entityId: the ID of the Elasticsearch entity.
     * @param dateEpoch: the current timestamp.
     * @return Elasticsearch index name
     */
    String getElasticIndexName(String entityId, long dateEpoch) {
        return String.format("%s_%d", getElasticIndexNamePrefix(entityId), dateEpoch);
    }

    /**
     * Create the index prefix given an Elasticsearch entity.
     * @param entityId: the ID of the Elasticsearch entity.
     * @return String index prefix.
     */
    String getElasticIndexNamePrefix(String entityId) {
        return String.format("%s", entityId);
    }

    /**
     * Returns a list of columns representing all the operations to be done on the data as a result of the groupbys
     * @param aggregationModel: the AggregationModel specifying which operations to be done.
     * @return a Sparky List of columns containing the name of the operations and their respective functions.
     */
    List<Column> getOperationColumns(AggregationModel aggregationModel) {
        String metricColumn = aggregationModel.metricColumn;
        return aggregationModel.operations.stream().map(aggEnum -> {
            switch (aggEnum) {
                case AVG:
                    return avg(metricColumn).alias(OperationEnum.AVG.toString().toLowerCase());
                case SUM:
                    return sum(metricColumn).alias(OperationEnum.SUM.toString().toLowerCase());
                case COUNT:
                    return count(metricColumn).alias(OperationEnum.COUNT.toString().toLowerCase());
                case MIN:
                    return min(metricColumn).alias(OperationEnum.MIN.toString().toLowerCase());
                case MAX:
                    return max(metricColumn).alias(OperationEnum.MAX.toString().toLowerCase());
                default:
                    throw new RuntimeException("Unsupported Aggregations");

            }
        }).collect(Collectors.toList());
    }
}
