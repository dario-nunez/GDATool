package com.mycompany.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonDeserialize(as = ImmutableVisualizationModel.class)
@JsonSerialize(as = ImmutableVisualizationModel.class)
public interface VisualizationModel {
    String id();
    String type();
}
