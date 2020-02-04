package com.mycompany.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value.Immutable;

import java.util.List;

@Immutable
@JsonDeserialize(as = ImmutableSchemaModel.class)
@JsonSerialize(as = ImmutableSchemaModel.class)
public interface SchemaModel {
    String datasetName();
    List<ColumnModel> schema();
}