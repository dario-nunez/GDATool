package com.mycompany;

import com.mycompany.configuration.DependencyFactory;
import com.mycompany.configuration.Environment;
import com.mycompany.models.ConfigModel;
import com.mycompany.models.ImmutableConfigModel;

import java.io.IOException;

/**
 * This class is used for dependency injection of in tests. It allows for mock environment, properties and services to
 * be defined and used by the test methods.
 */
public class TestDependencyFactory extends DependencyFactory {
    public TestDependencyFactory() throws IOException {
        super(Environment.LOCDEV);
    }

    /**
     * Overrides the buildConfigModel method to define a test config model. It ensures all tests are able to run using
     * local resources only.
     * @return a test configured ConfigModel immutable object.
     */
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
