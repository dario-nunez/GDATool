package com.mycompany.models;

import java.util.List;

public class SchemaModel {
    public String datasetName;
    public List<ColumnModel> schema;

    public SchemaModel(String datasetName, List<ColumnModel> schema) {
        this.datasetName = datasetName;
        this.schema = schema;
    }
}
