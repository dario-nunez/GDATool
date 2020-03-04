import * as chai from "chai";
import { before, describe, it } from "mocha";
import { IndexPatternBuilder } from "../../src/elasticsearchEntityJsonBuilders/indexPatternBuilder";
import { IESIndexPattern } from "../../src/elasticsearchModels/indexPatternModel";
import { expectedIndexPatternEntity } from "./elasticsearchBuilderTestResources/indexPatternBuilder.spec.resources";

/**
 * Index Pattern Builder tests.
 */
const assert = chai.assert;
let indexPatternBuilder: IndexPatternBuilder;

before(async () => {
    indexPatternBuilder = new IndexPatternBuilder();
});

describe("Index pattern Builder tests", () => {
    describe("create index pattern entity", () => {
        it("create populated index pattern succeeds", (done) => {
            const testIndexPatternSeed: IESIndexPattern = {
                _id: "test_id",
                index: "test_index",
                featureColumns: ["test_featureColumn1", "test_featureColumn2"],
                operations: ["test_agg1", "test_agg2"]
            };

            const json = indexPatternBuilder.getIndexPattern(testIndexPatternSeed);
            assert.deepEqual(json, expectedIndexPatternEntity);
            done();
        });
    });
});