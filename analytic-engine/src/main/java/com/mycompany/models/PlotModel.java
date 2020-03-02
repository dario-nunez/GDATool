package com.mycompany.models;

import java.util.Objects;

public class PlotModel {
    public String _id;
    public String __v;
    public String jobId;
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
        PlotModel plotModel = (PlotModel) o;
        return Objects.equals(_id, plotModel._id) &&
                Objects.equals(__v, plotModel.__v) &&
                Objects.equals(jobId, plotModel.jobId) &&
                Objects.equals(identifier, plotModel.identifier) &&
                Objects.equals(identifierType, plotModel.identifierType) &&
                Objects.equals(xAxis, plotModel.xAxis) &&
                Objects.equals(xType, plotModel.xType) &&
                Objects.equals(yAxis, plotModel.yAxis) &&
                Objects.equals(yType, plotModel.yType);
    }
}
