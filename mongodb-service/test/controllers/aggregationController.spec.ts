import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IAggregationModel } from "../../src/models/aggregationModel";
import { IJobModel } from "../../src/models/jobModel";
import { IUserModel } from "../../src/models/userModel";
import { AggregationRepository } from "../../src/repositories/aggregationRepository";
import { JobRepository } from "../../src/repositories/jobRepository";
import { UserRepository } from "../../src/repositories/userRepository";
import { deleteIfPresent } from "../deleteIfPresent.spec";

/**
 * Aggregation Controller tests.
 */
chai.use(chaiHttp);
const expect = chai.expect;
let userRepository: UserRepository;
let jobRepository: JobRepository;
let aggregationRepository: AggregationRepository;

const testUser: IUserModel = {
    _id: "333333333333333333333333",
    password: "user_test_password",
    email: "user_test_email_aggregationController",
    name: "user_test_user"
};

const testJob: IJobModel = {
    _id: "444444444444444444444444",
    userId: "",
    name: "job_test_name",
    description: "job_test_description",
    rawInputDirectory: "",
    stagingFileName: "",
    generateESIndices: true,
    jobStatus: 0
};

const testAggregation1: IAggregationModel = {
    _id: "555555555555555555555555",
    jobId: "",
    operations: [],
    featureColumns: [],
    metricColumn: "aggregation1_test_metricColumn",
    name: "aggregation1_test_name",
    sortColumnName: "aggregation1_test_sortColumnName"
};

const testAggregation2: IAggregationModel = {
    _id: "666666666666666666666666",
    jobId: "",
    operations: [],
    featureColumns: [],
    metricColumn: "aggregation2_test_metricColumn",
    name: "aggregation2_test_name",
    sortColumnName: "aggregation1_test_sortColumnName"
};

before(async () => {
    userRepository = new UserRepository();
    jobRepository = new JobRepository();
    aggregationRepository = new AggregationRepository();

    await deleteIfPresent(testUser, userRepository);
    await deleteIfPresent(testJob, jobRepository);
    await deleteIfPresent(testAggregation1, aggregationRepository);
    await deleteIfPresent(testAggregation2, aggregationRepository);

    await userRepository.create(testUser);
    testJob.userId = testUser._id;
    await jobRepository.create(testJob);
    testAggregation1.jobId = testJob._id;
    testAggregation2.jobId = testJob._id;
});

describe("Aggregation Controller tests", () => {
    describe("create aggregation", () => {
        it("create a single aggregation succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/aggregation")
                .send(testAggregation1)
                .end(function (err, res) {
                    const returnAggregation: IAggregationModel = res.body;
                    testAggregation1._id = returnAggregation._id;
                    expect(returnAggregation.name).to.equal(testAggregation1.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create a list of aggregations succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/aggregation/multiple")
                .send([testAggregation2])
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregationModel> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get aggregation", () => {
        it("get an aggregation by id with an existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/" + testAggregation1._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregationModel = res.body;
                    expect(returnAggregation.name).to.equal(testAggregation1.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get an aggregation by id with non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("get multiple aggregations with an existing user id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byUser/" + testUser._id)
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregationModel> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get multiple aggregations with a non existing user id fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byUser/wrongId")
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregationModel> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get multiple aggregations with an existing job id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byJob/" + testJob._id)
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregationModel> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get multiple aggregations with a non existing job id fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byJob/wrongId")
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregationModel> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all aggregations succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/getAll")
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregationModel> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("update aggregation", () => {
        it("update using correct aggregation id succeeds", (done) => {
            const updatedAggregation = Object.assign({}, testAggregation1);
            updatedAggregation.name = updatedAggregation.name + "_updated";

            chai.request("http://localhost:5000")
                .put("/ms/aggregation/" + updatedAggregation._id)
                .send(updatedAggregation)
                .end(function (err, res) {
                    const returnAggregation: IUserModel = res.body;
                    expect(returnAggregation.name).to.equal(testAggregation1.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("update using incoddecr aggregation id fails", (done) => {
            chai.request("http://localhost:5000")
                .put("/ms/aggregation/wrongId")
                .send({ name: testAggregation1.name })
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    describe("delete aggregaton", () => {
        it("delete aggregation using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("delete aggregation using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/" + testAggregation1._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregationModel = res.body;
                    expect(returnAggregation._id).to.equal(testAggregation1._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("delete job recursively succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/job/recursive/" + testJob._id)
                .end(function (err, res) {
                    const returnJob: IJobModel = res.body;
                    expect(returnJob._id).to.equal(testJob._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("delete user succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/user/" + testUser._id)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser._id).to.equal(testUser._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});