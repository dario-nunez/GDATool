import * as chai from "chai";
import { before, describe, it } from "mocha";
import { VisualizationBuilder } from "../../src/elasticsearchEntityJsonBuilders/visualizationBuilder";
import { ICluster } from "../../src/elasticsearchModels/clusterModel";
import { IDataTable } from "../../src/elasticsearchModels/dataTableModel";
import { IMetric } from "../../src/elasticsearchModels/metricModel";
import { IPlot } from "../../src/elasticsearchModels/plotModel";
import { IVisBarCHart } from "../../src/elasticsearchModels/visBarChartModel";
import { IVisMarkup } from "../../src/elasticsearchModels/visMarkupModel";
import { expectedBarChartVisualization, expectedClusterVisualization, expectedDataTableVisualization, expectedMarkupVisualization, expectedMetricVisualization, expectedPlotVisualization } from "./visualizationBuilder.spec.resources";

const assert = chai.assert;
let visualizationBuilder: VisualizationBuilder;

before(async () => {
    visualizationBuilder = new VisualizationBuilder();
});

describe("Visualization builder tests", () => {
    describe("create markup visualizations", () => {
        it("create succeeds", (done) => {
            const testMarkupSeed: IVisMarkup = {
                id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                displayTitle: "test_displayTitle"
            };

            const markupJson = visualizationBuilder.getMarkup(testMarkupSeed);
            assert.deepEqual(markupJson, expectedMarkupVisualization);
            done();
        });
    });

    describe("create bar chart visualizations", () => {
        it("create succeeds", (done) => {
            const testBarChartSeed: IVisBarCHart = {
                id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                aggregationName: "test_aggregationName",
                featureColumn: "test_featureColumn",
                metricColumn: "test_metricColumn",
                index: "test_index"
            };

            const markupJson = visualizationBuilder.getBarChart(testBarChartSeed);
            assert.deepEqual(markupJson, expectedBarChartVisualization);
            done();
        });
    });

    describe("create metric visualizations", () => {
        it("create succeeds", (done) => {
            const testMetricSeed: IMetric = {
                id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                aggregationName: "test_aggregationName",
                index: "test_index"
            };

            const markupJson = visualizationBuilder.getMetric(testMetricSeed);
            assert.deepEqual(markupJson, expectedMetricVisualization);
            done();
        });
    });

    describe("create data table visualizations", () => {
        it("create succeeds", (done) => {
            const testDataTableSeed: IDataTable = {
                id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                operations: ["test_operation1", "test_operation2"],
                featureColumns: ["test_featureColumn1", "test_featureColumn2"],
                index: "test_index"
            };

            const markupJson = visualizationBuilder.getDataTable(testDataTableSeed);
            assert.deepEqual(markupJson, expectedDataTableVisualization);
            done();
        });
    });

    describe("create plot visualizations", () => {
        it("create succeeds", (done) => {
            const testPlotSeed: IPlot = {
                id: "test_id",
                type: "test_type",
                index: "test_index",
                explorerTitle: "test_explorerTitle",
                identifier: "test_identifier",
                identifierType: "test_identifierType",
                xAxis: "test_xAxis",
                xType: "test_xType",
                yAxis: "test_yAxis",
                yType: "test_yType"
            };

            const markupJson = visualizationBuilder.getVegaPlot(testPlotSeed);
            assert.deepEqual(markupJson, expectedPlotVisualization);
            done();
        });
    });

    describe("create cluster visualizations", () => {
        it("create succeeds", (done) => {
            const testClusterSeed: ICluster = {
                id: "test_id",
                type: "test_cluster",
                index: "test_index",
                explorerTitle: "test_explorerTitle",
                identifier: "test_identifier",
                identifierType: "test_identifierType",
                xAxis: "test_xAxis",
                xType: "test_xType",
                yAxis: "test_yAxis",
                yType: "test_yType",
                cluster: 0
            };

            const markupJson = visualizationBuilder.getVegaCluster(testClusterSeed);
            assert.deepEqual(markupJson, expectedClusterVisualization);
            done();
        });
    });
});