import * as chai from "chai";
import { before, describe, it } from "mocha";
import { DashboardManager } from "../../src/elasticsearchEntityManagers/dashboardManager";
import { IESDashboard } from "../../src/elasticsearchModels/dashboardModel";
import { KibanaService } from "../../src/services/kibana-service";

/**
 * Dashboard Manager tests.
 */
const assert = chai.assert;
let dashboardManager: DashboardManager;
let kibanaService: KibanaService;

/**
 * Mocks the Kibana service so no calls are made to the real Elasticsearch cluster.
 */
before(async () => {
    kibanaService = new KibanaService();
    dashboardManager = new DashboardManager(kibanaService);
    kibanaService.createElasticsearchEntity = (): Promise<any> => {
        const returnPromise = Promise.resolve("Elasticsearch entity created... mock :)");
        return returnPromise;
    };
});

describe("Dashboard Manager tests", () => {
    describe("create dashboard", () => {
        it("create dashboard succeeds", (done) => {
            const dashboardSeed: IESDashboard = {
                _id: "jobId",
                title: "jobId",
                visualizations: [],
                description: "This is a dashboard description"
            };

            const json = dashboardManager.createDashboard("jobId", []);
            assert.deepEqual(json, dashboardSeed);
            done();
        });
    });
});