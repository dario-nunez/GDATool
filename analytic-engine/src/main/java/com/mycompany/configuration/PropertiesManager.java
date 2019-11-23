package com.mycompany.configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

class PropertiesManager {

    private Properties loadProperties(String filename) throws IOException {
        Properties prop = new Properties();
        InputStream commonInput = getClass().getClassLoader().getResourceAsStream(filename);
        prop.load(commonInput);
        return prop;
    }

    Properties loadPropertiesFromFullPath(String filePath) throws IOException {
        Properties prop = new Properties();
        File file = new File(filePath);
        InputStream fis = new FileInputStream(file);
        prop.load(fis);
        return prop;
    }

    Properties loadEnvironment(Environment environment) throws IOException {
        Properties commonProperties = loadProperties("common.properties");
        Properties envProperties = loadProperties(getEnvironmentPropertyFilename(environment));
        envProperties.putAll(commonProperties);
        return envProperties;
    }

    private String getEnvironmentPropertyFilename(Environment environment) {
        return environment.toString().toLowerCase() + ".properties";
    }
}
