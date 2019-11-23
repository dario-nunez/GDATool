package com.mycompany.models;

import org.immutables.value.Value.Immutable;
import javax.annotation.Nullable;

@Immutable
public interface ConfigModel {

    String accessKeyId();
    String secretAccessKey();
    String rawFilePath();
    String stagingFileName();
    String elasticsearchUrl();
    int elasticsearchPort();
    String stagingFolder();
    @Nullable
    String master();
    String appName();
    String mongodbRootUrl();
    String elasticsearchServiceRootUrl();
}
