package com.mycompany.jobs;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.OperationEnum;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import org.apache.spark.sql.Column;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.storage.StorageLevel;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;

import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

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
     * Reads a data file in .csv format, inferring its schema and returning it in the Dataset object.
     * @param path to the data file.
     * @return Dataset object containing the data in the file along with some metadata.
     */
    Dataset<Row> read(String path) {
        // Read csv
        logger.info(String.format("Reading %s", path));
        return sparkSession.read().format("csv")
                .option("inferSchema", true)
                .option("header", "true")
                .load(path)
                .persist(StorageLevel.MEMORY_AND_DISK_SER());
    }

    /**
     * Creates and returns the name of the elasticsearch index based on the given prefix.
     * @param entityId
     * @param dateEpoch
     * @return Elasticsaerch index name
     */
    String getElasticIndexName(String entityId, long dateEpoch) {
        return String.format("%s_%d", getElasticIndexNamePrefix(entityId), dateEpoch);
    }

    /**
     * Creates the index prefix given an aggregation
     * @param entityId
     * @return String index prefix
     */
    String getElasticIndexNamePrefix(String entityId) {
        return String.format("%s", entityId);
    }

    /**
     * Returns a list of columns representing all the operations to be done on the data as a result of the groupbys
     * @param aggregationModel
     * @return
     */
    List<Column> getAggregationColumns(AggregationModel aggregationModel) {
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
