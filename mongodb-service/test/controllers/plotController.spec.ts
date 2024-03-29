import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IJobModel } from "../../src/models/jobModel";
import { IPlotModel } from "../../src/models/plotModel";
import { JobRepository } from "../../src/repositories/jobRepository";
import { PlotRepository } from "../../src/repositories/plotRepository";
import { deleteIfPresent } from "../deleteIfPresent.spec";

/**
 * Plot Controller tests.
 */
chai.use(chaiHttp);
const expect = chai.expect;
let jobRepository: JobRepository;
let plotRepository: PlotRepository;

const testPlot1: IPlotModel = {
    _id: "777777777777777777777777",
    jobId: "",
    identifier: "plot1_test_identifier",
    identifierType: "plot1_test_identifierType",
    xAxis: "plot1_test_xAxis",
    xType: "plot1_test_xType",
    yAxis: "plot1_test_yAxis",
    yType: "plot1_test_yType"
};

const testPlot2: IPlotModel = {
    _id: "888888888888888888888888",
    jobId: "",
    identifier: "plot1_test_identifier",
    identifierType: "plot1_test_identifierType",
    xAxis: "plot1_test_xAxis",
    xType: "plot1_test_xType",
    yAxis: "plot1_test_yAxis",
    yType: "plot1_test_yType"
};

const testJob: IJobModel = {
    _id: "999999999999999999999999",
    name: "job_test_name",
    description: "job_test_description",
    rawInputDirectory: "",
    stagingFileName: "",
    userId: "101010101010101010101010",
    generateESIndices: true,
    jobStatus: 0
};

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

describe("Plot Controller tests", () => {
    describe("create plot", () => {
        it("create plot succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/plot")
                .send(testPlot1)
                .end(function (err, res) {
                    const returnPlot: IPlotModel = res.body;
                    testPlot1._id = returnPlot._id;
                    expect(returnPlot.identifier).to.equal(returnPlot.identifier);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create multiple plots succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/plot/multiple")
                .send([testPlot2])
                .end(function (err, res) {
                    const returnPlots: Array<IPlotModel> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(returnPlots).to.not.have.lengthOf(0);
                    expect(returnPlots[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get plot", () => {
        it("get plots with an existing job id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/plot/byJob/" + testJob._id)
                .end(function (err, res) {
                    const returnPlots: Array<IPlotModel> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(returnPlots).to.not.have.lengthOf(0);
                    expect(returnPlots[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get plots with a non existing job id fails", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/plot/byJob/wrongId")
                .end(function (err, res) {
                    const returnPlots: Array<IPlotModel> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(returnPlots).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all plots succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/plot/getAll")
                .end(function (err, res) {
                    const returnPlots: Array<IPlotModel> = res.body;
                    expect(returnPlots).to.be.an('array');
                    expect(returnPlots).to.not.have.lengthOf(0);
                    expect(returnPlots[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("delete plots", () => {
        it("delete plot with non existing plot id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/plot/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("delete plot with existing plot id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/plot/" + testPlot1._id)
                .end(function (err, res) {
                    const returnPlot: IPlotModel = res.body;
                    expect(returnPlot._id).to.equal(returnPlot._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("delete plot2 with existing plot id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/plot/" + testPlot2._id)
                .end(function (err, res) {
                    const returnPlot: IPlotModel = res.body;
                    expect(returnPlot._id).to.equal(returnPlot._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("delete job succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/job/" + testJob._id)
                .end(function (err, res) {
                    const returnJob: IJobModel = res.body;
                    expect(returnJob._id).to.equal(testJob._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});