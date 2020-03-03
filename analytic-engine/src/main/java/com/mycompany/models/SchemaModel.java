package com.mycompany.models;

import java.util.List;

/**
 * Represents the schema of a dataset. It contains the dataset name and a schema property which stores metadata about
 * each column int he dataset.
 *
 * A schema object is a compressed representation of the original dataset (OD). It contains the same range of values
 * as the OD but it does not store what values belong to each record. It also stores metadata about the dataset and each
 * of its columns.
 *
 * SchemaModel objects and formatted version of them are used in the website-ui to build an interface that requires
 * access to all possible values that could be given to all columns but cannot afford to be slowed down by keeping the
 * entire OD in memory. The website-ui has access to the SchemaModel of the dataset it's dealing with.
 */
public class SchemaModel {
    public String datasetName;
    public List<ColumnModel> schema;

    public SchemaModel(String datasetName, List<ColumnModel> schema) {
        this.datasetName = datasetName;
        this.schema = schema;
    }
}
