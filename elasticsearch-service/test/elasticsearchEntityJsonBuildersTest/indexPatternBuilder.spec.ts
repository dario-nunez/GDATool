import * as chai from "chai";
import { before, describe, it } from "mocha";
import { IndexPatternBuilder } from "../../src/elasticsearchEntityJsonBuilders/indexPatternBuilder";
import { IIndexPattern } from "../../src/elasticsearchModels/indexPatternModel";
import { expectedIndexPatternEntity } from "./indexPatternBuilder.spec.resources";

const assert = chai.assert;
let indexPatternBuilder: IndexPatternBuilder;

before(async () => {
    indexPatternBuilder = new IndexPatternBuilder();
});

describe("Index pattern builder tests", () => {
    describe("create index pattern entity", () => {
        it("create succeeds", (done) => {
            const testIndexPatternSeed: IIndexPattern = {
                id: "test_id",
                index: "test_index",
                featureColumns: ["test_featureColumn1", "test_featureColumn2"],
                aggs: ["test_agg1", "test_agg2"]
            };

            const json = indexPatternBuilder.getIndexPattern(testIndexPatternSeed);
            assert.deepEqual(json, expectedIndexPatternEntity);
            done();
        });
    });
});