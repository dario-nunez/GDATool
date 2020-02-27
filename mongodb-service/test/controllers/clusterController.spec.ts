import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IAggregation } from "../../src/models/aggregationModel";
import { ICluster } from "../../src/models/clusterModel";
import { AggregationRepository } from "../../src/repositories/aggregationRepository";
import { ClusterRepository } from "../../src/repositories/clusterRerpository";
import { Repository } from "../../src/repositories/repository";

chai.use(chaiHttp);
const expect = chai.expect;
let aggregationRepository: AggregationRepository;
let clusterRepository: ClusterRepository;

const testcluster1 = {
    _id: "121212121212121212121212",
    aggId: "",
    identifier: "cluster1_test_identifier",
    identifierType: "cluster1_test_identifierType",
    xAxis: "cluster1_test_xAxis",
    xType: "cluster1_test_xType",
    yAxis: "cluster1_test_yAxis",
    yType: "cluster1_test_yType",
    cluster: 0
} as ICluster;

const testcluster2 = {
    _id: "131313131313131313131313",
    aggId: "",
    identifier: "cluster1_test_identifier",
    identifierType: "cluster1_test_identifierType",
    xAxis: "cluster1_test_xAxis",
    xType: "cluster1_test_xType",
    yAxis: "cluster1_test_yAxis",
    yType: "cluster1_test_yType",
    cluster: 0
} as ICluster;

const testAggregation = {
    _id: "141414141414141414141414",
    jobId: "151515151515151515151515",
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
    clusterRepository = new ClusterRepository();

    await deleteIfPresent(testAggregation, aggregationRepository);
    await deleteIfPresent(testcluster1, clusterRepository);
    await deleteIfPresent(testcluster2, clusterRepository);

    await aggregationRepository.create(testAggregation);
    testcluster1.aggId = testAggregation._id;
    testcluster2.aggId = testAggregation._id;
});

describe("cluster controller tests", () => {
    describe("create cluster", () => {
        it("create cluster succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/cluster")
                .send(testcluster1)
                .end(function (err, res) {
                    const returncluster: ICluster = res.body;
                    testcluster1._id = returncluster._id;
                    expect(returncluster.identifier).to.equal(returncluster.identifier);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create a list clusters succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/cluster/multiple")
                .send([testcluster2])
                .end(function (err, res) {
                    const returnclusters: Array<ICluster> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.not.have.lengthOf(0);
                    expect(returnclusters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get cluster", () => {
        it("get clusters with an existing aggregation id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/cluster/byAgg/" + testAggregation._id)
                .end(function (err, res) {
                    const returnclusters: Array<ICluster> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.not.have.lengthOf(0);
                    expect(returnclusters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get clusters with a non existing aggregation id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/cluster/byAgg/wrongId")
                .end(function (err, res) {
                    const returnclusters: Array<ICluster> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all clusters returns a list of users", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/cluster/getAll")
                .end(function (err, res) {
                    const returnclusters: Array<ICluster> = res.body;
                    expect(returnclusters).to.be.an('array');
                    expect(returnclusters).to.not.have.lengthOf(0);
                    expect(returnclusters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("delete clusters", () => {
        it("cluster using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/cluster/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("cluster using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/cluster/" + testcluster1._id)
                .end(function (err, res) {
                    const returncluster: ICluster = res.body;
                    expect(returncluster._id).to.equal(returncluster._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("cluster2 using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/cluster/" + testcluster2._id)
                .end(function (err, res) {
                    const returncluster: ICluster = res.body;
                    expect(returncluster._id).to.equal(returncluster._id);
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