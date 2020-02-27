import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IAggregation } from "../../../common-service/src/models/aggregationModel";
import { IJob } from "../../../common-service/src/models/jobModel";
import { IUser } from "../../../common-service/src/models/userModel";
import { AggregationRepository } from "../../../common-service/src/repositories/aggregationRepository";
import { JobRepository } from "../../../common-service/src/repositories/jobRepository";
import { UserRepository } from "../../../common-service/src/repositories/userRepository";

chai.use(chaiHttp);
const expect = chai.expect;
let userRepository: UserRepository;
let jobRepository: JobRepository;
let aggregationRepository: AggregationRepository;

const testUser = {
    _id: "333333333333333333333333",
    password: "user_test_password",
    email: "user_test_email",
    name: "user_test_user",
    dashboards: [],
    roles: []
} as IUser;

const testJob = {
    _id: "444444444444444444444444",
    userId: "",
    name: "job_test_name",
    description: "job_test_description",
    rawInputDirectory: "",
    stagingFileName: "",
    generateESIndices: true,
    runs: [],
    jobStatus: 0,
} as IJob;

const testAggregation1 = {
    _id: "555555555555555555555555",
    jobId: "",
    aggs: [],
    featureColumns: [],
    metricColumn: "aggregation1_test_metricColumn",
    name: "aggregation1_test_name"
} as IAggregation;

const testAggregation2 = {
    _id: "666666666666666666666666",
    jobId: "",
    aggs: [],
    featureColumns: [],
    metricColumn: "aggregation2_test_metricColumn",
    name: "aggregation2_test_name"
} as IAggregation;

before(async () => {
    userRepository = new UserRepository();
    jobRepository = new JobRepository();
    aggregationRepository = new AggregationRepository();

    const existingUser = await userRepository.getById(testUser._id);
    if (existingUser) {
        await userRepository.delete(existingUser._id);
    }

    const existingjob = await jobRepository.getById(testJob._id);
    if (existingjob) {
        await jobRepository.delete(existingjob._id);
    }

    const existingAggregation = await aggregationRepository.getById(testAggregation1._id);
    if (existingAggregation) {
        await aggregationRepository.delete(existingAggregation._id);
    }

    const existingAggregation2 = await aggregationRepository.getById(testAggregation2._id);
    if (existingAggregation2) {
        await aggregationRepository.delete(existingAggregation2._id);
    }

    await userRepository.create(testUser);
    testJob.userId = testUser._id;
    await jobRepository.create(testJob);
    testAggregation1.jobId = testJob._id;
    testAggregation2.jobId = testJob._id;
});

describe("Aggregation controller tests", () => {
    describe("create aggregation", () => {
        it("create aggregation succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/aggregation")
                .send(testAggregation1)
                .end(function (err, res) {
                    const returnAggregation: IAggregation = res.body;
                    testAggregation1._id = returnAggregation._id;
                    expect(returnAggregation.name).to.equal(testAggregation1.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create a list aggregation succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/aggregation/multiple")
                .send([testAggregation2])
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregation> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get aggregation", () => {
        it("get an aggregation by id with existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/" + testAggregation1._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregation = res.body;
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

        it("get aggregations with an existing user id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byUser/" + testUser._id)
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregation> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get aggregations with a non existing user id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byUser/wrongId")
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregation> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get aggregations with an existing job id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byJob/" + testJob._id)
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregation> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get aggregations with a non existing job id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/byJob/wrongId")
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregation> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all users returns a list of users", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/aggregation/getAll")
                .end(function (err, res) {
                    const returnAggregations: Array<IAggregation> = res.body;
                    expect(returnAggregations).to.be.an('array');
                    expect(returnAggregations).to.not.have.lengthOf(0);
                    expect(returnAggregations[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("update aggregation", () => {
        it("using correct id updates the user", (done) => {
            const updatedAggregation = Object.assign({}, testAggregation1);
            updatedAggregation.name = updatedAggregation.name + "_updated";

            chai.request("http://localhost:5000")
                .put("/ms/aggregation/" + updatedAggregation._id)
                .send(updatedAggregation)
                .end(function (err, res) {
                    const returnAggregation: IUser = res.body;
                    expect(returnAggregation.name).to.equal(testAggregation1.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("using incorrect id does not update the user", (done) => {
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
        it("aggregation using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("aggregation using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/" + testAggregation1._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregation = res.body;
                    expect(returnAggregation._id).to.equal(testAggregation1._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("aggregation2 using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/" + testAggregation2._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregation = res.body;
                    expect(returnAggregation._id).to.equal(testAggregation2._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("job deletion succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/job/" + testJob._id)
                .end(function (err, res) {
                    const returnJob: IJob = res.body;
                    expect(returnJob._id).to.equal(testJob._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("user deletion succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/user/" + testUser._id)
                .end(function (err, res) {
                    const returnUser: IUser = res.body;
                    expect(returnUser._id).to.equal(testUser._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});