package com.mycompany.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Define a more advanced and customisable logging library. It is also used by Spark internally.
 */
public interface Log {
    default Logger logger() {
        return LoggerFactory.getLogger(this.getClass());
    }
}

