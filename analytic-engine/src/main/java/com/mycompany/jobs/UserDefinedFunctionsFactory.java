package com.mycompany.jobs;

import org.apache.spark.sql.api.java.UDF1;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class UserDefinedFunctionsFactory {
    UDF1<String, String> createMonthYearColumn() {
        return (UDF1<String, String>) dateString -> {
            LocalDateTime localDate = LocalDateTime.parse(dateString, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            return localDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
        };
    }
}
