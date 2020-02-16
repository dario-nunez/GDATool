package com.mycompany.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public interface Log {
    default Logger logger() {
        return LoggerFactory.getLogger(this.getClass());
    }
}

