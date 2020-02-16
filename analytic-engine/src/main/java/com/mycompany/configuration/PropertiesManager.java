package com.mycompany.configuration;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

class PropertiesManager {
    /**
     * Loads common properties containing: AWS authentication details.
     * Loads environment properties containing: API URLs, Spark configuration and storage details.
     * @param environment defined in console arguments.
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
     * Loads the data in a property file and saves it in property objects.
     * @param filename of the property file.
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
     * Constructs the filename of property files based on the environment set.
     * @param environment defined in console arguments.
     * @return Property file name.
     */
    private String getEnvironmentPropertyFilename(Environment environment) {
        return environment.toString().toLowerCase() + ".properties";
    }
}

