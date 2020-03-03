package com.mycompany.configuration;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Handles the dynamic loading of properties from Resource.properties files.
 */
class PropertiesManager {
    /**
     * Load common properties containing: AWS authentication details.
     * Load environment properties containing: API URLs, Spark configuration and storage details.
     * @param environment: defined in console arguments.
     * @return Property map containing all property fields and their associated values.
     * @throws IOException
     */
    public Properties loadEnvironment(Environment environment) throws IOException {
        Properties commonProperties = loadProperties("common.properties");
        Properties envProperties = loadProperties(getEnvironmentPropertyFilename(environment));
        envProperties.putAll(commonProperties);
        return envProperties;
    }

    /**
     * Load the data in a property file and save it in a property object.
     * @param filename: the name of the property file.
     * @return A Property object containing the data in the input file.
     * @throws IOException
     */
    private Properties loadProperties(String filename) throws IOException {
        Properties prop = new Properties();
        InputStream commonInput = getClass().getClassLoader().getResourceAsStream(filename);
        prop.load(commonInput);
        return prop;
    }

    /**
     * Construct the filename of property file based on the environment set.
     * @param environment: defined in console arguments.
     * @return Property file name.
     */
    private String getEnvironmentPropertyFilename(Environment environment) {
        return environment.toString().toLowerCase() + ".properties";
    }
}

