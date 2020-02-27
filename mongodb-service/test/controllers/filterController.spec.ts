import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IAggregation } from "../../src/models/aggregationModel";
import { IFilter } from "../../src/models/filterModel";
import { AggregationRepository } from "../../src/repositories/aggregationRepository";
import { FilterRepository } from "../../src/repositories/filterRepository";
import { Repository } from "../../src/repositories/repository";

chai.use(chaiHttp);
const expect = chai.expect;
let aggregationRepository: AggregationRepository;
let filterRepository: FilterRepository;

const testfilter1 = {
    _id: "161616161616161616161616",
    aggId: "",
    query: "fliter1_test_query"
} as IFilter;

const testfilter2 = {
    _id: "171717171717171717171717",
    aggId: "",
    query: "fliter2_test_query"
} as IFilter;

const testAggregation = {
    _id: "181818181818181818181818",
    jobId: "191919191919191919191919",
    aggs: [],
    featureColumns: [],
    metricColumn: "aggregation_test_metricColumn",
    name: "aggregation_test_name"
} as IAggregation;

async function deleteIfPresent(model: any, repository: Repository<any>) {
    const existingModel = await repository.getById(model._id);
    if (existingModel) {
        await repository.delete(existingModel._id);
    }
}

before(async () => {
    aggregationRepository = new AggregationRepository();
    filterRepository = new FilterRepository();

    await deleteIfPresent(testAggregation, aggregationRepository);
    await deleteIfPresent(testfilter1, filterRepository);
    await deleteIfPresent(testfilter2, filterRepository);

    await aggregationRepository.create(testAggregation);
    testfilter1.aggId = testAggregation._id;
    testfilter2.aggId = testAggregation._id;
});

describe("filter controller tests", () => {
    describe("create filter", () => {
        it("create filter succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/filter")
                .send(testfilter1)
                .end(function (err, res) {
                    const returnfilter: IFilter = res.body;
                    testfilter1._id = returnfilter._id;
                    expect(returnfilter.query).to.equal(returnfilter.query);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create a list filters succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/filter/multiple")
                .send([testfilter2])
                .end(function (err, res) {
                    const returnfilters: Array<IFilter> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.not.have.lengthOf(0);
                    expect(returnfilters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get filter", () => {
        it("get filters with an existing aggregation id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/filter/byAgg/" + testAggregation._id)
                .end(function (err, res) {
                    const returnfilters: Array<IFilter> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.not.have.lengthOf(0);
                    expect(returnfilters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get filters with a non existing aggregation id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/filter/byAgg/wrongId")
                .end(function (err, res) {
                    const returnfilters: Array<IFilter> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all filters returns a list of users", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/filter/getAll")
                .end(function (err, res) {
                    const returnfilters: Array<IFilter> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.not.have.lengthOf(0);
                    expect(returnfilters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("delete filters", () => {
        it("filter using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/filter/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("filter using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/filter/" + testfilter1._id)
                .end(function (err, res) {
                    const returnfilter: IFilter = res.body;
                    expect(returnfilter._id).to.equal(returnfilter._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("filter2 using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/filter/" + testfilter2._id)
                .end(function (err, res) {
                    const returnfilter: IFilter = res.body;
                    expect(returnfilter._id).to.equal(returnfilter._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("aggregation2 using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/" + testAggregation._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregation = res.body;
                    expect(returnAggregation._id).to.equal(testAggregation._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});