package com.mycompany.jobs;

import org.apache.spark.mllib.clustering.KMeansModel;
import org.apache.spark.mllib.linalg.Vector;
import org.apache.spark.sql.api.java.UDF1;
import org.apache.spark.sql.api.java.UDF2;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class UserDefinedFunctionsFactory {
    UDF1<String, String> createMonthYearColumn() {
        return (UDF1<String, String>) dateString -> {
            LocalDateTime localDate = LocalDateTime.parse(dateString, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            return localDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
        };
    }

    UDF2<Double, Double, Double> selectCluster(KMeansModel model) {
        return (UDF2<Double, Double, Double>) (f1, f2) -> {
            return Double.valueOf(1);
        };
    }
}
