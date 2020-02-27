import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IJob } from "../../../common-service/src/models/jobModel";
import { JobRepository } from "../../../common-service/src/repositories/jobRepository";
import { PlotRepository } from "../../../common-service/src/repositories/plotRepository";
import { Repository } from "../../../common-service/src/repositories/repository";
import { IPlot } from "../../src/models/plotModel";

chai.use(chaiHttp);
const expect = chai.expect;
let jobRepository: JobRepository;
let plotRepository: PlotRepository;

const testPlot1 = {
    _id: "777777777777777777777777",
    jobId: "",
    identifier: "plot1_test_identifier",
    identifierType: "plot1_test_identifierType",
    xAxis: "plot1_test_xAxis",
    xType: "plot1_test_xType",
    yAxis: "plot1_test_yAxis",
    yType: "plot1_test_yType"
} as IPlot;

const testPlot2 = {
    _id: "888888888888888888888888",
    jobId: "",
    identifier: "plot1_test_identifier",
    identifierType: "plot1_test_identifierType",
    xAxis: "plot1_test_xAxis",
    xType: "plot1_test_xType",
    yAxis: "plot1_test_yAxis",
    yType: "plot1_test_yType"
} as IPlot;


const testJob = {
    _id: "999999999999999999999999",
    name: "job_test_name",
    description: "job_test_description",
    rawInputDirectory: "",
    stagingFileName: "",
    userId: "101010101010101010101010",
    generateESIndices: true,
    runs: [],
    jobStatus: 0,
} as IJob;

async function deleteIfPresent(model: any, repository: Repository<any>) {
    const existingModel = await repository.getById(model._id);
    if (existingModel) {
        await repository.delete(existingModel._id);
    }
}

before(async () => {
    jobRepository = new JobRepository();
    plotRepository = new PlotRepository();

    await deleteIfPresent(testJob, jobRepository);
    await deleteIfPresent(testPlot1, plotRepository);
    await deleteIfPresent(testPlot2, plotRepository);

    await jobRepository.create(testJob);
    testPlot1.jobId = testJob._id;
    testPlot2.jobId = testJob._id;
});

describe("Plot controller tests", () => {
    describe("create plot", () => {
        it("create plot succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/plot")
                .send(testPlot1)
                .end(function (err, res) {
                    const returnPlot: IPlot = res.body;
                    testPlot1._id = returnPlot._id;
                    expect(returnPlot.identifier).to.equal(returnPlot.identifier);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create a list plots succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/plot/multiple")
                .send([testPlot2])
                .end(function (err, res) {
                    const returnPlots: Array<IPlot> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(returnPlots).to.not.have.lengthOf(0);
                    expect(returnPlots[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get plot", () => {
        it("get aggregations with an existing job id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/plot/byJob/" + testJob._id)
                .end(function (err, res) {
                    const returnPlots: Array<IPlot> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(returnPlots).to.not.have.lengthOf(0);
                    expect(returnPlots[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get aggregations with a non existing job id", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/plot/byJob/wrongId")
                .end(function (err, res) {
                    const returnPlots: Array<IPlot> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all plots returns a list of users", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/plot/getAll")
                .end(function (err, res) {
                    const returnPlots: Array<IPlot> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(returnPlots).to.not.have.lengthOf(0);
                    expect(returnPlots[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("delete plots", () => {
        it("plot using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/plot/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("plot using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/plot/" + testPlot1._id)
                .end(function (err, res) {
                    const returnPlot: IPlot = res.body;
                    expect(returnPlot._id).to.equal(returnPlot._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("plot2 using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/plot/" + testPlot2._id)
                .end(function (err, res) {
                    const returnPlot: IPlot = res.body;
                    expect(returnPlot._id).to.equal(returnPlot._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});