import { ApiServer } from "../src/api-server";
import { start } from "../src/start";

let apiServer: ApiServer;

before(async () => {
    apiServer = await start();
    return apiServer;
});

after(async () => {
    return apiServer.stop();
});