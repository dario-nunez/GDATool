package com.mycompany.models;

import java.util.Objects;

public class JobModel {
    public String _id;
    public String __v;
    public String name;
    public Integer jobStatus;
    public String description;
    public String userId;
    public String rawInputDirectory;
    public String stagingFileName;
    public String createdAt;
    public String updatedAt;
    public boolean generateESIndices;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JobModel jobModel = (JobModel) o;
        return generateESIndices == jobModel.generateESIndices &&
                Objects.equals(_id, jobModel._id) &&
                Objects.equals(__v, jobModel.__v) &&
                Objects.equals(name, jobModel.name) &&
                Objects.equals(jobStatus, jobModel.jobStatus) &&
                Objects.equals(description, jobModel.description) &&
                Objects.equals(userId, jobModel.userId) &&
                Objects.equals(rawInputDirectory, jobModel.rawInputDirectory) &&
                Objects.equals(stagingFileName, jobModel.stagingFileName) &&
                Objects.equals(createdAt, jobModel.createdAt) &&
                Objects.equals(updatedAt, jobModel.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(_id, __v, name, jobStatus, description, userId, rawInputDirectory, stagingFileName, createdAt, updatedAt, generateESIndices);
    }
}
