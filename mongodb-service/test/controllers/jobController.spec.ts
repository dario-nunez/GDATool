import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IJobModel } from "../../src/models/jobModel";
import { IUserModel } from "../../src/models/userModel";
import { JobRepository } from "../../src/repositories/jobRepository";
import { UserRepository } from "../../src/repositories/userRepository";
import { deleteIfPresent } from "../deleteIfPresent.spec";

chai.use(chaiHttp);
const expect = chai.expect;
let userRepository: UserRepository;
let jobRepository: JobRepository;

const testUser = {
    _id: "111111111111111111111111",
    password: "user_test_password",
    email: "user_test_email_jobController",
    name: "user_test_user"
} as IUserModel;

const testJob1 = {
    _id: "222222222222222222222222",
    name: "job1_test_name",
    description: "job1_test_description",
    rawInputDirectory: "",
    stagingFileName: "",
    userId: "",
    generateESIndices: true,
    jobStatus: 0
} as IJobModel;

const testJob2 = {
    _id: "202020202020202020202020",
    name: "job2_test_name",
    description: "job2_test_description",
    rawInputDirectory: "",
    stagingFileName: "",
    userId: "",
    generateESIndices: true,
    jobStatus: 0
} as IJobModel;

before(async () => {
    userRepository = new UserRepository();
    jobRepository = new JobRepository();

    await deleteIfPresent(testUser, userRepository);
    await deleteIfPresent(testJob1, jobRepository);
    await deleteIfPresent(testJob2, jobRepository);
});

describe("User controller tests", () => {
    describe("create user and job", () => {
        it("create user with a unique email succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user")
                .send(testUser)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    testUser._id = returnUser._id;
                    testJob1.userId = testUser._id;
                    testJob2.userId = testUser._id;
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create job1 succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/job/noAws")
                .send(testJob1)
                .end(function (err, res) {
                    const returnJob: IJobModel = res.body;
                    testJob1._id = returnJob._id;
                    expect(returnJob.name).to.equal(testJob1.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create job2 succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/job/noAws")
                .send(testJob2)
                .end(function (err, res) {
                    const returnJob: IJobModel = res.body;
                    testJob2._id = returnJob._id;
                    expect(returnJob.name).to.equal(testJob2.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get job", () => {
        it("get a job by id with existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/job/" + testJob1._id)
                .end(function (err, res) {
                    const returnJob: IJobModel = res.body;
                    expect(returnJob._id).to.equal(testJob1._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get a job by id with non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/job/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("get jobs by user", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/job/byUser/" + testUser._id)
                .end(function (err, res) {
                    const returnJobs: Array<IJobModel> = res.body;
                    expect(returnJobs).to.be.an('array');
                    expect(returnJobs).to.have.lengthOf(2);
                    expect(returnJobs[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all jobs returns a list of jobs", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/job/getAll")
                .end(function (err, res) {
                    const returnJobs: Array<IJobModel> = res.body;
                    expect(returnJobs).to.be.an('array');
                    expect(returnJobs[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("update job", () => {
        it("using correct id updates the job", (done) => {
            const updatedJob = Object.assign({}, testJob1);
            updatedJob.name = updatedJob.name + "_updated";

            chai.request("http://localhost:5000")
                .put("/ms/job/" + updatedJob._id)
                .send(updatedJob)
                .end(function (err, res) {
                    const returnJob: IJobModel = res.body;
                    expect(returnJob.name).to.equal(testJob1.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("using incorrect id does not update the job", (done) => {
            chai.request("http://localhost:5000")
                .put("/ms/job/wrongId")
                .send({ name: testJob1.name })
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    describe("delete job", () => {
        it("using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/job/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/job/" + testJob1._id)
                .end(function (err, res) {
                    const returnJob: IJobModel = res.body;
                    expect(returnJob._id).to.equal(testJob1._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("user deletion succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/user/recursive/" + testUser._id)
                .end(function (err, res) {
                    const returnUser: IUserModel = res.body;
                    expect(returnUser._id).to.equal(testUser._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});