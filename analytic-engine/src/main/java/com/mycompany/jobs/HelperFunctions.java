package com.mycompany.jobs;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import scala.collection.JavaConverters;
import scala.collection.Seq;

import java.util.ArrayList;
import java.util.List;

public class HelperFunctions {
    public static String replaceCharacter = "_";

    public static String getValidColumnName(String columnName) {
        String retColumnName = columnName;
        String[] invalidCharacters = {" ", "/" , ",", ";", "{", "}", "(", ")", "\n", "t="};

        for (String invChar : invalidCharacters) {
            if (retColumnName.contains(invChar)) {
                retColumnName = retColumnName.replace(invChar, replaceCharacter);
            }
        }
        return retColumnName;
    }

    private static Seq<String> convertListToSeqString(List<String> inputList) {
        return JavaConverters.asScalaIteratorConverter(inputList.iterator()).asScala().toSeq();
    }

    public static Dataset<Row> getValidDataset(Dataset<Row> dataset) {
        String[] oldColumnNames = dataset.columns();
        List<String> newColumnNames = new ArrayList<>();

        for (String columnName : oldColumnNames) {
            newColumnNames.add(HelperFunctions.getValidColumnName(columnName));
        }

        Seq<String> newColumnNamesSeq = HelperFunctions.convertListToSeqString(newColumnNames);

        return dataset.toDF(newColumnNamesSeq);
    }
}
