import * as chai from "chai";
import { before, describe, it } from "mocha";
import logger from "../../mongodb-service/src/logger/loggerFactory";
import { VisualizationBuilder } from "../src/elasticsearchEntityJsonBuilders/visualizationBuilder";
import { IVisMarkup } from "../src/elasticsearchModels/visMarkupModel";
import { testMarkupVis } from "./visualizationBuilder.spec.resources";

const assert = chai.assert;
let visualizationBuilder: VisualizationBuilder;

before(async () => {
   visualizationBuilder = new VisualizationBuilder();
});

describe("Aggregation controller tests", () => {
    describe("create aggregation", () => {
        it("create aggregation succeeds", (done) => {
            const testMarkupSeed: IVisMarkup = {
                id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                displayTitle: "test_displayTitle"
            };

            const markupJson = visualizationBuilder.getMarkup(testMarkupSeed);

            logger.info(markupJson.data.visualization.kibanaSavedObjectMeta);

            assert.deepEqual(markupJson, testMarkupVis);
            done();
        });

        // it("create a list aggregation succeeds", (done) => {
        //     chai.request("http://localhost:5000")
        //         .post("/ms/aggregation/multiple")
        //         .send([testAggregation2])
        //         .end(function (err, res) {
        //             const returnAggregations: Array<IAggregationModel> = res.body;
        //             expect(returnAggregations).to.be.an('array');
        //             expect(returnAggregations).to.not.have.lengthOf(0);
        //             expect(returnAggregations[0]).to.have.ownProperty("_id");
        //             expect(res).to.have.status(200);
        //             done();
        //         });
        // });
    });
});