import * as chai from "chai";
import { before, describe, it } from "mocha";
import { VisualizationManager } from "../../src/elasticsearchEntityManagers/visualizationManager";
import { IESVisualization } from "../../src/elasticsearchModels/visualizationModel";
import { KibanaService } from "../../src/services/kibana-service";

/**
 * Visualization Manager tests.
 */
const assert = chai.assert;
let visualizationManager: VisualizationManager;
let kibanaService: KibanaService;

/**
 * Mocks the Kibana service so no calls are made to the real Elasticsearch cluster.
 */
before(async () => {
    kibanaService = new KibanaService();
    visualizationManager = new VisualizationManager(kibanaService);
    kibanaService.createElasticsearchEntity = (): Promise<any> => {
        const returnPromise = Promise.resolve("Elasticsearch entity created... mock :)");
        return returnPromise;
    };
});

describe("Visualization Manager tests", () => {
    describe("create markup visualization", () => {
        it("create markup visualization succeeds", (done) => {
            const visualization: IESVisualization = {
                _id: "test_id_markdown",
                type: "markdown"
            };

            const json = visualizationManager.createMarkupVis("test_id", "test_type");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create bar chart visualization", () => {
        it("create bar chart visualization succeeds", (done) => {
            const visualization: IESVisualization = {
                _id: "test_id_bar",
                type: "bar"
            };

            const json = visualizationManager.createBarChartVis("test_id", "aggregationName", "metricColumn", "featureColumn", "indexPatternId");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create metric visualization", () => {
        it("create metric visualization succeeds", (done) => {
            const visualization: IESVisualization = {
                _id: "test_id_metric",
                type: "metric"
            };

            const json = visualizationManager.createMetricVis("test_id", "aggregationName", "indexPatternId");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create data table visualization", () => {
        it("create data table visualization succeeds", (done) => {
            const visualization: IESVisualization = {
                _id: "test_id_table",
                type: "table"
            };

            const json = visualizationManager.createDataTableVis("test_id", "aggregationName", [], [], "indexPatternId");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create plot visualization", () => {
        it("create plot visualization succeeds", (done) => {
            const visualization: IESVisualization = {
                _id: "test_id_plot",
                type: "plot"
            };

            const json = visualizationManager.createPlotVis("test_id", "index", "identifier", "identifierType", "xAxis", "xType", "yAxis", "yType");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create cluster visualization", () => {
        it("create cluster visualization succeeds", (done) => {
            const visualization: IESVisualization = {
                _id: "test_id_cluster",
                type: "cluster"
            };

            const json = visualizationManager.createClusterVis("test_id", "index", "identifier", "identifierType", "xAxis", "xType", "yAxis", "yType");
            assert.deepEqual(json, visualization);
            done();
        });
    });
});