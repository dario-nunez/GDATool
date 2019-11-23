package com.mycompany.jobs;

import com.google.inject.Inject;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mycompany.models.AggregationEnum;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.services.bi.BiRepository;
import com.mycompany.services.mongodb.MongodbRepository;
import org.apache.spark.sql.Column;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.StructType;
import org.apache.spark.storage.StorageLevel;
import org.slf4j.Logger;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.spark.sql.functions.*;

public abstract class Job {

    Logger logger;
    SparkSession sparkSession;
    ConfigModel configModel;
    MongodbRepository mongodbRepository;
    BiRepository biRepository;
    UserDefinedFunctionsFactory userDefinedFunctionsFactory;

    @Inject
    Job(SparkSession sparkSession, ConfigModel configModel, MongodbRepository mongodbRepository, BiRepository biRepository,
        UserDefinedFunctionsFactory userDefinedFunctionsFactory) {
        this.sparkSession = sparkSession;
        this.configModel = configModel;
        this.mongodbRepository = mongodbRepository;
        this.biRepository = biRepository;
        this.userDefinedFunctionsFactory = userDefinedFunctionsFactory;
    }

    Dataset<Row> read(String path, StructType schema) {
        // Read csv
        logger.info(String.format("Reading %s", path));

        return sparkSession.read().format("csv")
                .schema(schema)
                .option("header", "false")
                .load(path)
                .persist(StorageLevel.MEMORY_AND_DISK_SER());
    }

    Dataset<Row> read(String path) {
        // Read csv
        logger.info(String.format("Reading %s", path));
        return sparkSession.read().format("csv")
                .option("inferSchema", true)
                .option("header", "true")
                .load(path)
                .persist(StorageLevel.MEMORY_AND_DISK_SER());
    }

    protected StructType getSchema() {
        throw new RuntimeException("not implemented");
    }

    String getElasticIndexName(AggregationModel aggregationModel, long dateEpoch) {
        return String.format("%s_%d", getElasticIndexNamePrefix(aggregationModel),
                dateEpoch);
    }

    String getElasticIndexNamePrefix(AggregationModel aggregationModel) {
        return String.format("%s", aggregationModel._id());
    }

    List<Column> getAggregationColumns(AggregationModel aggregationModel) {
        String metricColumn = aggregationModel.metricColumn();
        return aggregationModel.aggs().stream().map(aggEnum -> {
            switch (aggEnum) {
                case AVG:
                    return avg(metricColumn).alias(AggregationEnum.AVG.toString().toLowerCase());
                case SUM:
                    return sum(metricColumn).alias(AggregationEnum.SUM.toString().toLowerCase());
                case COUNT:
                    return count(metricColumn).alias(AggregationEnum.COUNT.toString().toLowerCase());
                case MIN:
                    return min(metricColumn).alias(AggregationEnum.MIN.toString().toLowerCase());
                case MAX:
                    return max(metricColumn).alias(AggregationEnum.MAX.toString().toLowerCase());
                default:
                    throw new RuntimeException("Unsupported Aggregations");

            }
        }).collect(Collectors.toList());
    }

    public abstract void run(String jobId, String userId) throws IOException, UnirestException;
}