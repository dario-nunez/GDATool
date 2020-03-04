import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IAggregationModel } from "../../src/models/aggregationModel";
import { IClusterModel } from "../../src/models/clusterModel";
import { AggregationRepository } from "../../src/repositories/aggregationRepository";
import { ClusterRepository } from "../../src/repositories/clusterRerpository";
import { deleteIfPresent } from "../deleteIfPresent.spec";

/**
 * Cluster Controller tests.
 */
chai.use(chaiHttp);
const expect = chai.expect;
let aggregationRepository: AggregationRepository;
let clusterRepository: ClusterRepository;

const testcluster1: IClusterModel = {
    _id: "121212121212121212121212",
    aggId: "",
    aggName: "",
    identifier: "cluster1_test_identifier",
    identifierType: "cluster1_test_identifierType",
    xAxis: "cluster1_test_xAxis",
    xType: "cluster1_test_xType",
    yAxis: "cluster1_test_yAxis",
    yType: "cluster1_test_yType"
};

const testcluster2: IClusterModel = {
    _id: "131313131313131313131313",
    aggId: "",
    aggName: "",
    identifier: "cluster2_test_identifier",
    identifierType: "cluster2_test_identifierType",
    xAxis: "cluster2_test_xAxis",
    xType: "cluster2_test_xType",
    yAxis: "cluster2_test_yAxis",
    yType: "cluster2_test_yType"
};

const testAggregation: IAggregationModel = {
    _id: "141414141414141414141414",
    jobId: "151515151515151515151515",
    operations: [],
    featureColumns: [],
    metricColumn: "aggregation_test_metricColumn",
    name: "aggregation_test_name",
    sortColumnName: "aggregation1_test_sortColumnName"
};

before(async () => {
    aggregationRepository = new AggregationRepository();
    clusterRepository = new ClusterRepository();

    await deleteIfPresent(testAggregation, aggregationRepository);
    await deleteIfPresent(testcluster1, clusterRepository);
    await deleteIfPresent(testcluster2, clusterRepository);

    await aggregationRepository.create(testAggregation);
    testcluster1.aggId = testAggregation._id;
    testcluster2.aggId = testAggregation._id;
    testcluster1.aggName = testAggregation.name;
    testcluster2.aggName = testAggregation.name;
});

describe("Cluster Controller tests", () => {
    describe("create cluster", () => {
        it("create a single cluster succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/cluster")
                .send(testcluster1)
                .end(function (err, res) {
                    const returncluster: IClusterModel = res.body;
                    testcluster1._id = returncluster._id;
                    expect(returncluster.identifier).to.equal(returncluster.identifier);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create multiple clusters succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/cluster/multiple")
                .send([testcluster2])
                .end(function (err, res) {
                    const returnclusters: Array<IClusterModel> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.not.have.lengthOf(0);
                    expect(returnclusters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get cluster", () => {
        it("get clusters with an existing aggregation id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/cluster/byAgg/" + testAggregation._id)
                .end(function (err, res) {
                    const returnclusters: Array<IClusterModel> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.not.have.lengthOf(0);
                    expect(returnclusters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get clusters with a non existing aggregation id return empty list and succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/cluster/byAgg/wrongId")
                .end(function (err, res) {
                    const returnclusters: Array<IClusterModel> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all clusters succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/cluster/getAll")
                .end(function (err, res) {
                    const returnclusters: Array<IClusterModel> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.not.have.lengthOf(0);
                    expect(returnclusters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("delete clusters", () => {
        it("delete cluster using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/cluster/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("delete cluster using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/cluster/" + testcluster1._id)
                .end(function (err, res) {
                    const returncluster: IClusterModel = res.body;
                    expect(returncluster._id).to.equal(returncluster._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("delete aggregation recursively succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/recursive/" + testAggregation._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregationModel = res.body;
                    expect(returnAggregation._id).to.equal(testAggregation._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});