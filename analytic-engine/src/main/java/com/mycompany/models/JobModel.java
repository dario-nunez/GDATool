package com.mycompany.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;
import org.immutables.value.Value.Immutable;

import javax.annotation.Nullable;
import java.util.List;

@Immutable
@JsonDeserialize(as = ImmutableJobModel.class)
@JsonSerialize(as = ImmutableJobModel.class)
public interface JobModel {
    @Nullable
    String _id();
    @Nullable
    String __v();
    @Nullable
    String name();
    @Nullable
    List<String> runs();
    @Nullable
    String jobStatus();
    String description();
    String userId();
    String rawInputDirectory();
    String stagingFileName();
    String createdAt();
    String updatedAt();
    @Value.Default
    default boolean generateESIndices() {
        return false;
    }
}
