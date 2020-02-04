package com.mycompany.models;

import java.util.List;

public class ColumnModel {
    public String name;
    public String type;
    public List<String> range;

    public ColumnModel(String name, String type, List<String> range) {
        this.name = name;
        this.type = type;
        this.range = range;
    }
}
