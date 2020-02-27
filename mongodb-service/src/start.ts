'use strict';

import { MongoConnector } from './mongodbConnector';
import { ApiServer } from './api-server';

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

    // Stop graceful
    process.on('SIGTERM', graceful);
    process.on('SIGINT', graceful);

    return apiServer;
}
