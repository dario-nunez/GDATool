'use strict';

import logger from './logger/loggerFactory';
import { start } from './start';

/**
 * The file executed by the "npm run start" command. It starts the API server.
 */
start().catch((err) => {
    logger.error(`Error starting server: ${err.message}`);
    process.exit(-1);
});
