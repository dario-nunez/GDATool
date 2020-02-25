package com.mycompany.models;

import java.util.Objects;

public class FilterModel {
    public String _id;
    public String __v;
    public String aggId;
    public String query;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FilterModel that = (FilterModel) o;
        return Objects.equals(_id, that._id) &&
                Objects.equals(__v, that.__v) &&
                Objects.equals(aggId, that.aggId) &&
                Objects.equals(query, that.query);
    }

    @Override
    public int hashCode() {
        return Objects.hash(_id, __v, aggId, query);
    }
}
