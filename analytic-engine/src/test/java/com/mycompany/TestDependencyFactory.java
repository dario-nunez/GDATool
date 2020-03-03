package com.mycompany;

import com.mycompany.configuration.DependencyFactory;
import com.mycompany.configuration.Environment;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableConfigModel;

import java.io.IOException;

public class TestDependencyFactory extends DependencyFactory {

    /**
     * Instantiates the environment, jobId variable and builds the Config Model.
     *
     * @throws IOException
     */
    public TestDependencyFactory() throws IOException {
        super(Environment.LOCDEV);
    }

    @Override
    public ConfigModel buildConfigModel() {
        return ImmutableConfigModel.builder()
                .awsAccessKeyIdEnvVariable("awsAccessKeyIdEnvVariable")
                .awsSecretAccessKeyEnvVariable("awsSecretAccessKeyEnvVariable")
                .appName("testGDATool")
                .bucketRoot("src/test/test-resources")
                .stagingFolder("src/test/test-resources/root")
                .elasticsearchServiceUrl("http://localhost:5020/es/")
                .elasticsearchPort("9200")
                .master("local")
                .mongodbServiceUrl("http://localhost:5000/ms/")
                .elasticsearchUrl("localhost")
                .build();
    }
}
