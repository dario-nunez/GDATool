import * as chai from "chai";
import { before, describe, it } from "mocha";
// import logger from "../../../mongodb-service/src/logger/loggerFactory";
import { IndexPatternManager } from "../../src/elasticsearchEntityManagers/indexPatternManager";
import { IIndexPattern } from "../../src/elasticsearchModels/indexPatternModel";
import { KibanaService } from "../../src/services/kibana-service";

const assert = chai.assert;
let indexPatternManager: IndexPatternManager;
let kibanaService: KibanaService;

before(async () => {
    kibanaService = new KibanaService();
    indexPatternManager = new IndexPatternManager(kibanaService);
    kibanaService.createElasticsearchEntity = (): Promise<any> => {
        const returnPromise = Promise.resolve("Elasticsearch entity created... mock :)");
        return returnPromise;
    };
});

describe("Index pattern manager tests", () => {
    describe("create index pattern", () => {
        it("create succeeds", (done) => {
            const indexPatternSeed: IIndexPattern = {
                id: "aggregationId",
                index: "aggregationId",
                featureColumns: ["featureColumn1", "featureColumn2"],
                aggs: ["agg1, agg2"].map((e) => e.toLowerCase())
            };

            const json = indexPatternManager.createIndexPattern("aggregationId", ["agg1, agg2"], ["featureColumn1", "featureColumn2"]);
            assert.deepEqual(json, indexPatternSeed);
            done();
        });
    });
});