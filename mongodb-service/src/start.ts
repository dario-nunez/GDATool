'use strict';

import { MongoConnector } from './mongodbConnector';
import { ApiServer } from './api-server';

/**
 * Instantiate a Mongodb conenction and the API. Handles the starting of the API
 * Server and the stopping of it and the Mongodb connection.
 */
export async function start(): Promise<ApiServer> {
    const mongoConnector = new MongoConnector();
    const apiServer = new ApiServer();

    await apiServer.start();
    await mongoConnector.connect();

    const graceful = async () => {
        await mongoConnector.disconnect();
        await apiServer.stop();
        process.exit(0);
    };

    // Stop gracefully.
    process.on('SIGTERM', graceful);
    process.on('SIGINT', graceful);

    return apiServer;
}
