package com.mycompany.models;

import java.util.List;

public class JobModel {
    public String _id;
    public String __v;
    public String name;
    public List<String> runs;
    public Integer jobStatus;
    public String description;
    public String userId;
    public String rawInputDirectory;
    public String stagingFileName;
    public String createdAt;
    public String updatedAt;
    public boolean generateESIndices;
}
