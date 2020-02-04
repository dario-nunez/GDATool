package com.mycompany.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;
import java.util.List;

@Value.Immutable
@JsonDeserialize(as = ImmutableColumnModel.class)
@JsonSerialize(as = ImmutableColumnModel.class)
public interface ColumnModel {
    String name();
    String type();
    List<String> range();
}