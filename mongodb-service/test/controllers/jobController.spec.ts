import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IJob } from "../../../common-service/src/models/jobModel";
import { IUser } from "../../../common-service/src/models/userModel";
import { JobRepository } from "../../../common-service/src/repositories/jobRepository";
import { Repository } from "../../../common-service/src/repositories/repository";
import { UserRepository } from "../../../common-service/src/repositories/userRepository";

chai.use(chaiHttp);
const expect = chai.expect;
let userRepository: UserRepository;
let jobRepository: JobRepository;

const testUser = {
    _id: "111111111111111111111111",
    password: "user_test_password",
    email: "user_test_email",
    name: "user_test_user",
    dashboards: [],
    roles: []
} as IUser;

const testJob = {
    _id: "222222222222222222222222",
    name: "job_test_name",
    description: "job_test_description",
    rawInputDirectory: "",
    stagingFileName: "",
    userId: "",
    generateESIndices: true,
    runs: [],
    jobStatus: 0,
} as IJob;

async function deleteIfPresent(model: any, repository: Repository<any> ) {
    const existingModel = await repository.getById(model._id);
    if (existingModel) {
        await repository.delete(existingModel._id);
    }
}

before(async () => {
    userRepository = new UserRepository();
    jobRepository = new JobRepository();

    await deleteIfPresent(testUser, userRepository);
    await deleteIfPresent(testJob, jobRepository);
});

describe("User controller tests", () => {
    describe("create user and job", () => {
        it("create user with a unique email succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/user")
                .send(testUser)
                .end(function (err, res) {
                    const returnUser: IUser = res.body;
                    testUser._id = returnUser._id;
                    testJob.userId = testUser._id;
                    expect(returnUser.name).to.equal(testUser.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create job succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/job/noAws")
                .send(testJob)
                .end(function (err, res) {
                    const returnJob: IJob = res.body;
                    testJob._id = returnJob._id;
                    expect(returnJob.name).to.equal(testJob.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get job", () => {
        it("get a job by id with existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/job/" + testJob._id)
                .end(function (err, res) {
                    const returnJob: IJob = res.body;
                    expect(returnJob._id).to.equal(testJob._id);
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

        it("get user by email with existing email", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/job/byUser/" + testUser._id)
                .end(function (err, res) {
                    const returnJobs: Array<IJob> = res.body;
                    expect(returnJobs).to.be.an('array');
                    expect(returnJobs).to.have.lengthOf(1);
                    expect(returnJobs[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all jobs returns a list of jobs", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/job/getAll")
                .end(function (err, res) {
                    const returnJobs: Array<IJob> = res.body;
                    expect(returnJobs).to.be.an('array');
                    expect(returnJobs[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("update job", () => {
        it("using correct id updates the job", (done) => {
            const updatedJob = Object.assign({}, testJob);
            updatedJob.name = updatedJob.name + "_updated";

            chai.request("http://localhost:5000")
                .put("/ms/job/" + updatedJob._id)
                .send(updatedJob)
                .end(function (err, res) {
                    const returnJob: IJob = res.body;
                    expect(returnJob.name).to.equal(testJob.name);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("using incorrect id does not update the job", (done) => {
            chai.request("http://localhost:5000")
                .put("/ms/job/wrongId")
                .send({ name: testJob.name })
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