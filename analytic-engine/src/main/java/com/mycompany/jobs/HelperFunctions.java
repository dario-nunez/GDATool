package com.mycompany.jobs;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.types.DataType;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructField;
import scala.collection.JavaConverters;
import scala.collection.Seq;

import java.util.ArrayList;
import java.util.List;

import static org.apache.spark.sql.functions.col;

/**
 * Define functions that can be used by both jobs.
 */
public class HelperFunctions {
    public static String replaceCharacter = "_";

    /**
     * Converts invalid column names, into valid ones. The definition of invalid is set by the Spark documentation.
     * Spark functions only support a narrow range of column header formats.
     * @param columnName: name of the column to be validated.
     * @return a validated and Spark ready column name.
     */
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

    /**
     * Converts a List of Strings to a scala sequence of Strings
     * @param inputList: List of Strings.
     * @return scala Seq of Strings.
     */
    public static Seq<String> convertListToSeqString(List<String> inputList) {
        return JavaConverters.asScalaIteratorConverter(inputList.iterator()).asScala().toSeq();
    }

    /**
     * Validates the column names for an entire Dataset.
     * @param dataset: The raw dataset with unvalidated column headers.
     * @return a Dataset object containing the same values, but Spark validated column headers
     */
    public static Dataset<Row> getValidDataset(Dataset<Row> dataset) {
        String[] oldColumnNames = dataset.columns();
        List<String> newColumnNames = new ArrayList<>();

        for (String columnName : oldColumnNames) {
            newColumnNames.add(HelperFunctions.getValidColumnName(columnName));
        }

        Seq<String> newColumnNamesSeq = HelperFunctions.convertListToSeqString(newColumnNames);

        return dataset.toDF(newColumnNamesSeq);
    }

    /**
     * Cast a List of columns to Strings
     * @param dataset: the raw dataset without casted columns.
     * @param featureColumns: the List of columns to be casted.
     * @return a Dataset with unchanged values but casted columns.
     */
    public static Dataset<Row> stringifyFeatureColumns(Dataset<Row> dataset, List<String> featureColumns) {
        for (String featureColumn : featureColumns) {
            dataset = dataset.withColumn(featureColumn, col(featureColumn).cast("String"));
        }

        return dataset;
    }

    /**
     * Simplify the column types of a dataset to either Double (numeric) or String (text). The definition of a
     * numeric type is inferred from the Spark documentation.
     * @param dataset: the raw dataset.
     * @return a Dataset object with unchanged values but all columns are casted to Double or String.
     */
    public static Dataset<Row> simplifyTypes(Dataset<Row> dataset) {
        List<DataType> sparkNumericTypes = new ArrayList<DataType>() {
            {
                add(DataTypes.ByteType);
                add(DataTypes.ShortType);
                add(DataTypes.IntegerType);
                add(DataTypes.LongType);
                add(DataTypes.FloatType);
                add(DataTypes.DoubleType);
            }
        };

        StructField[] schema = dataset.schema().fields();

        // For each column in the dataset, simplify its type.
        for (StructField field : schema) {
            if (sparkNumericTypes.contains(field.dataType())) {
                dataset = dataset.withColumn(field.name(), col(field.name()).cast(DataTypes.DoubleType));
            } else {
                dataset = dataset.withColumn(field.name(), col(field.name()).cast(DataTypes.StringType));
            }
        }

        return dataset.cache();
    }
}
