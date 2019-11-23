package com.mycompany;

import com.mycompany.configuration.Environment;
import com.mycompany.configuration.Module;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableConfigModel;

public class TestModule extends Module {

    public TestModule(String jobId) {
        super(Environment.LOCAL, jobId);
    }

    @Override
    protected ConfigModel buildConfigModel() {
        return ImmutableConfigModel.builder()
                .accessKeyId("awsAccessKeyIdEnvVariable")
                .appName("testApp")
                .elasticsearchPort(9200)
                .elasticsearchUrl("localhost")
                .master("local")
                .rawFilePath("src/test/test-resources/root")
                .secretAccessKey("awsSecretAccessKeyEnvVariable")
                .stagingFileName("stagingFileName")
                .stagingFolder("src/test/test-resources/root/")
                .mongodbRootUrl("http://localhost:5000/ms/")
                .elasticsearchServiceRootUrl("http://localhost:5020/es/")
                .build();
    }
}
