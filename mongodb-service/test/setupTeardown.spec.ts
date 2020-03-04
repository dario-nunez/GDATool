import { ApiServer } from "../src/api-server";
import { start } from "../src/start";

/**
 * Handles the root level before and after hooks for the mocha tests.
 */
let apiServer: ApiServer;

before(async () => {
    apiServer = await start();
    return apiServer;
});

after(async () => {
    return apiServer.stop();
});