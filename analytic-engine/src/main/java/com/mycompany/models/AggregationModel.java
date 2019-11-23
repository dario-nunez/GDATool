package com.mycompany.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value.Immutable;

import javax.annotation.Nullable;
import java.util.List;

@Immutable
@JsonDeserialize(as = ImmutableAggregationModel.class)
@JsonSerialize(as = ImmutableAggregationModel.class)
public interface AggregationModel {
    @Nullable
    String _id();
    @Nullable
    String __v();
    List<AggregationEnum> aggs();
    List<String> featureColumns();
    @Nullable
    String jobId();
    String metricColumn();
    String name();
    @Nullable
    String sortColumnName();
}