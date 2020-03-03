package com.mycompany.models;

import java.util.Objects;

public class ClusterModel {
    public String _id;
    public String __v;
    public String aggId;
    public String aggName;
    public String identifier;
    public String identifierType;
    public String xAxis;
    public String xType;
    public String yAxis;
    public String yType;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClusterModel that = (ClusterModel) o;
        return Objects.equals(_id, that._id) &&
                Objects.equals(__v, that.__v) &&
                Objects.equals(aggId, that.aggId) &&
                Objects.equals(aggName, that.aggName) &&
                Objects.equals(identifier, that.identifier) &&
                Objects.equals(identifierType, that.identifierType) &&
                Objects.equals(xAxis, that.xAxis) &&
                Objects.equals(xType, that.xType) &&
                Objects.equals(yAxis, that.yAxis) &&
                Objects.equals(yType, that.yType);
    }
}
