import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IAggregationModel } from "../../../mongodb-service/src/models/aggregationModel";
import { IClusterModel } from "../../../mongodb-service/src/models/clusterModel";
import { IJobModel } from "../../../mongodb-service/src/models/jobModel";
import { IPlotModel } from "../../../mongodb-service/src/models/plotModel";
import { IUserModel } from "../../../mongodb-service/src/models/userModel";
import { AggregationRepository } from "../../../mongodb-service/src/repositories/aggregationRepository";
import { ClusterRepository } from "../../../mongodb-service/src/repositories/clusterRerpository";
import { JobRepository } from "../../../mongodb-service/src/repositories/jobRepository";
import { PlotRepository } from "../../../mongodb-service/src/repositories/plotRepository";
import { UserRepository } from "../../../mongodb-service/src/repositories/userRepository";
import { deleteIfPresent } from "../../../mongodb-service/test/deleteIfPresent.spec";
import { DashboardBuilderController } from "../../src/controllers/dashboardBuilderController";
import { KibanaService } from "../../src/services/kibana-service";
import { MongodbService } from "../../src/services/mongodb-service";
import { expectedDashboardSeed } from "./controllersTestResources/dashboardController.spec.resources";

chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;
let userRepository: UserRepository;
let jobRepository: JobRepository;
let aggregationRepository: AggregationRepository;
let plotRepository: PlotRepository;
let clusterRerpository: ClusterRepository;
let dashboardBuilderController: DashboardBuilderController;
let kibanaServiceMock: KibanaService;
let mongodbService: MongodbService;

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

const testPlot1 = {
    _id: "777777777777777777777777",
    jobId: "",
    identifier: "plot1_test_identifier",
    identifierType: "plot1_test_identifierType",
    xAxis: "plot1_test_xAxis",
    xType: "plot1_test_xType",
    yAxis: "plot1_test_yAxis",
    yType: "plot1_test_yType"
} as IPlotModel;

const testPlot2 = {
    _id: "888888888888888888888888",
    jobId: "",
    identifier: "plot1_test_identifier",
    identifierType: "plot1_test_identifierType",
    xAxis: "plot1_test_xAxis",
    xType: "plot1_test_xType",
    yAxis: "plot1_test_yAxis",
    yType: "plot1_test_yType"
} as IPlotModel;

const testAggregation1 = {
    _id: "555555555555555555555555",
    jobId: "",
    aggs: ["agg1", "agg2"],
    featureColumns: ["featCol1", "featCol2"],
    metricColumn: "aggregation1_test_metricColumn",
    name: "aggregation1_test_name",
    sortColumnName: "aggregation1_test_sortColumnName"
} as IAggregationModel;

const testAggregation2 = {
    _id: "666666666666666666666666",
    jobId: "",
    aggs: ["agg1", "agg2"],
    featureColumns: ["featCol1", "featCol2"],
    metricColumn: "aggregation2_test_metricColumn",
    name: "aggregation2_test_name",
    sortColumnName: "aggregation1_test_sortColumnName"
} as IAggregationModel;

const testcluster1 = {
    _id: "121212121212121212121212",
    aggId: "",
    identifier: "cluster1_test_identifier",
    identifierType: "cluster1_test_identifierType",
    xAxis: "cluster1_test_xAxis",
    xType: "cluster1_test_xType",
    yAxis: "cluster1_test_yAxis",
    yType: "cluster1_test_yType"
} as IClusterModel;

const testcluster2 = {
    _id: "131313131313131313131313",
    aggId: "",
    identifier: "cluster2_test_identifier",
    identifierType: "cluster2_test_identifierType",
    xAxis: "cluster2_test_xAxis",
    xType: "cluster2_test_xType",
    yAxis: "cluster2_test_yAxis",
    yType: "cluster2_test_yType"
} as IClusterModel;

before(async () => {
    mongodbService = new MongodbService();
    kibanaServiceMock = new KibanaService();
    kibanaServiceMock.createElasticsearchEntity = (): Promise<any> => {
        const returnPromise = Promise.resolve("Elasticsearch entity created... mock :)");
        return returnPromise;
    };

    dashboardBuilderController = new DashboardBuilderController(kibanaServiceMock, mongodbService);

    userRepository = new UserRepository();
    jobRepository = new JobRepository();
    aggregationRepository = new AggregationRepository();
    plotRepository = new PlotRepository();
    clusterRerpository = new ClusterRepository();

    await deleteIfPresent(testUser, userRepository);
    await deleteIfPresent(testJob1, jobRepository);
    await deleteIfPresent(testAggregation1, aggregationRepository);
    await deleteIfPresent(testAggregation2, aggregationRepository);
    await deleteIfPresent(testPlot1, plotRepository);
    await deleteIfPresent(testPlot2, plotRepository);
    await deleteIfPresent(testcluster1, clusterRerpository);
    await deleteIfPresent(testcluster2, clusterRerpository);

    await userRepository.create(testUser);
    testJob1.userId = testUser._id;
    await jobRepository.create(testJob1);
    testPlot1.jobId = testJob1._id;
    testPlot2.jobId = testJob1._id;
    await plotRepository.create(testPlot1);
    await plotRepository.create(testPlot2);
    testAggregation1.jobId = testJob1._id;
    testAggregation2.jobId = testJob1._id;
    await aggregationRepository.create(testAggregation1);
    await aggregationRepository.create(testAggregation2);
    testcluster1.aggId = testAggregation1._id;
    testcluster2.aggId = testAggregation2._id;
    await clusterRerpository.create(testcluster1);
    await clusterRerpository.create(testcluster2);
});

describe("Builder controller tests", () => {
    describe("Testing the ednpoints", () => {
        it("Status endpoit returns a string", (done) => {
            chai.request("http://localhost:5020")
                .get("/es/dashboardBuilder/status")
                .end(function (err, res) {
                    expect(res.text).to.equal("listening :)");
                    done();
                });
        });

        it("Basic dashboard endpoint returns a dashboard seed", async () => {
            const json = await dashboardBuilderController.createBasicDashboard(testJob1._id);
            assert.equal(JSON.stringify(json), JSON.stringify(expectedDashboardSeed));
        });

        it("Cleanup", async () => {
            await deleteIfPresent(testUser, userRepository);
            await deleteIfPresent(testJob1, jobRepository);
            await deleteIfPresent(testAggregation1, aggregationRepository);
            await deleteIfPresent(testAggregation2, aggregationRepository);
            await deleteIfPresent(testPlot1, plotRepository);
            await deleteIfPresent(testPlot2, plotRepository);
            await deleteIfPresent(testcluster1, clusterRerpository);
            await deleteIfPresent(testcluster2, clusterRerpository);
        });
    });
});