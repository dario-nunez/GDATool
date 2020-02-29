import * as chai from "chai";
import { before, describe, it } from "mocha";
import { VisualizationManager } from "../../src/elasticsearchEntityManagers/visualizationManager";
import { IVisualization } from "../../src/elasticsearchModels/visualizationModel";
import { KibanaService } from "../../src/services/kibana-service";

const assert = chai.assert;
let visualizationManager: VisualizationManager;
let kibanaService: KibanaService;

before(async () => {
    kibanaService = new KibanaService();
    visualizationManager = new VisualizationManager(kibanaService);
    kibanaService.createElasticsearchEntity = (): Promise<any> => {
        const returnPromise = Promise.resolve("Elasticsearch entity created... mock :)");
        return returnPromise;
    };
});

describe("Visualization manager tests", () => {
    describe("create markup visualizations", () => {
        it("create succeeds", (done) => {
            const visualization: IVisualization = {
                id: "test_id_markdown",
                type: "markdown"
            };

            const json = visualizationManager.createVisMarkup("test_id", "test_type");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create bar chart visualizations", () => {
        it("create succeeds", (done) => {
            const visualization: IVisualization = {
                id: "test_id_bar",
                type: "bar"
            };

            const json = visualizationManager.createVisBarChart("test_id", "aggregationName", "metricColumn", "featureColumn", "indexPatternId");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create metric visualizations", () => {
        it("create succeeds", (done) => {
            const visualization: IVisualization = {
                id: "test_id_metric",
                type: "metric"
            };

            const json = visualizationManager.createMetric("test_id", "aggregationName", "indexPatternId");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create data table visualizations", () => {
        it("create succeeds", (done) => {
            const visualization: IVisualization = {
                id: "test_id_table",
                type: "table"
            };

            const json = visualizationManager.createDataTable("test_id", "aggregationName", [], [], "indexPatternId");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create plot visualizations", () => {
        it("create succeeds", (done) => {
            const visualization: IVisualization = {
                id: "test_id_plot",
                type: "plot"
            };

            const json = visualizationManager.createPlot("test_id", "index", "identifier", "identifierType", "xAxis", "xType", "yAxis", "yType");
            assert.deepEqual(json, visualization);
            done();
        });
    });

    describe("create cluster visualizations", () => {
        it("create succeeds", (done) => {
            const visualization: IVisualization = {
                id: "test_id_cluster",
                type: "cluster"
            };

            const json = visualizationManager.createCluster("test_id", "index", "identifier", "identifierType", "xAxis", "xType", "yAxis", "yType");
            assert.deepEqual(json, visualization);
            done();
        });
    });
});