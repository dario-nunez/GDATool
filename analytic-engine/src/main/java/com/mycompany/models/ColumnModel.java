package com.mycompany.models;

import java.util.List;

/**
 * Represents a Column object within a Schema object of a dataset. It contains metadata about a column in a dataset.
 */
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
