package com.mycompany.models;

import java.util.List;
import java.util.Objects;

/**
 * Represents an Aggregation object. Corresponds to the IAggregationModel type in the mongodb-service.
 */
public class AggregationModel {
    public String _id;
    public String __v;
    public List<OperationEnum> operations;
    public List<String> featureColumns;
    public String jobId;
    public String metricColumn;
    public String name;
    public String sortColumnName;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AggregationModel that = (AggregationModel) o;
        return Objects.equals(_id, that._id) &&
                Objects.equals(__v, that.__v) &&
                Objects.equals(operations, that.operations) &&
                Objects.equals(featureColumns, that.featureColumns) &&
                Objects.equals(jobId, that.jobId) &&
                Objects.equals(metricColumn, that.metricColumn) &&
                Objects.equals(name, that.name) &&
                Objects.equals(sortColumnName, that.sortColumnName);
    }
}
