import * as chai from "chai";
import { before, describe, it } from "mocha";
import { VisualizationBuilder } from "../../src/elasticsearchEntityJsonBuilders/visualizationBuilder";
import { IESBarChartVis } from "../../src/elasticsearchModels/barChartVisModel";
import { IESClusterVis } from "../../src/elasticsearchModels/clusterVisModel";
import { IESDataTableVis } from "../../src/elasticsearchModels/dataTableVisModel";
import { IESMarkupVis } from "../../src/elasticsearchModels/markupVisModel";
import { IESMetricVis } from "../../src/elasticsearchModels/metricVisModel";
import { IESPlotVis } from "../../src/elasticsearchModels/plotVisModel";
import { expectedBarChartVisualization, expectedClusterVisualization, expectedDataTableVisualization, expectedMarkupVisualization, expectedMetricVisualization, expectedPlotVisualization } from "./elasticsearchBuilderTestResources/visualizationBuilder.spec.resources";

/**
 * Visualization Builder tests.
 */
const assert = chai.assert;
let visualizationBuilder: VisualizationBuilder;

before(async () => {
    visualizationBuilder = new VisualizationBuilder();
});

describe("Visualization Builder tests", () => {
    describe("create markup visualization", () => {
        it("create markup visualization succeeds", (done) => {
            const testMarkupSeed: IESMarkupVis = {
                _id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                displayText: "test_displayTitle"
            };

            const json = visualizationBuilder.getMarkup(testMarkupSeed);
            assert.deepEqual(json, expectedMarkupVisualization);
            done();
        });
    });

    describe("create bar chart visualization", () => {
        it("create bar chart visualization succeeds", (done) => {
            const testBarChartSeed: IESBarChartVis = {
                _id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                operationName: "test_aggregationName",
                featureColumn: "test_featureColumn",
                metricColumn: "test_metricColumn",
                index: "test_index"
            };

            const json = visualizationBuilder.getBarChart(testBarChartSeed);
            assert.deepEqual(json, expectedBarChartVisualization);
            done();
        });
    });

    describe("create metric visualization", () => {
        it("create metric visualization succeeds", (done) => {
            const testMetricSeed: IESMetricVis = {
                _id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                operationName: "test_aggregationName",
                index: "test_index"
            };

            const json = visualizationBuilder.getMetric(testMetricSeed);
            assert.deepEqual(json, expectedMetricVisualization);
            done();
        });
    });

    describe("create data table visualization", () => {
        it("create data table visualization succeeds", (done) => {
            const testDataTableSeed: IESDataTableVis = {
                _id: "test_id",
                type: "test_type",
                explorerTitle: "test_explorerTitle",
                operations: ["test_operation1", "test_operation2"],
                featureColumns: ["test_featureColumn1", "test_featureColumn2"],
                index: "test_index"
            };

            const json = visualizationBuilder.getDataTable(testDataTableSeed);
            assert.deepEqual(json, expectedDataTableVisualization);
            done();
        });
    });

    describe("create plot visualization", () => {
        it("create plot visualization succeeds", (done) => {
            const testPlotSeed: IESPlotVis = {
                _id: "test_id",
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

            const json = visualizationBuilder.getVegaPlot(testPlotSeed);
            assert.deepEqual(json, expectedPlotVisualization);
            done();
        });
    });

    describe("create cluster visualization", () => {
        it("create cluster visualization succeeds", (done) => {
            const testClusterSeed: IESClusterVis = {
                _id: "test_id",
                type: "test_cluster",
                index: "test_index",
                explorerTitle: "test_explorerTitle",
                identifier: "test_identifier",
                identifierType: "test_identifierType",
                xAxis: "test_xAxis",
                xType: "test_xType",
                yAxis: "test_yAxis",
                yType: "test_yType",
            };

            const json = visualizationBuilder.getVegaCluster(testClusterSeed);
            assert.deepEqual(json, expectedClusterVisualization);
            done();
        });
    });
});