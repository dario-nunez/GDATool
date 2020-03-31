import { Inject } from "typescript-ioc";
import { VisualizationBuilder } from "../elasticsearchEntityJsonBuilders/visualizationBuilder";
import { IESBarChartVis } from "../elasticsearchModels/barChartVisModel";
import { IESClusterVis } from "../elasticsearchModels/clusterVisModel";
import { IESDataTableVis } from "../elasticsearchModels/dataTableVisModel";
import { IESMarkupVis } from "../elasticsearchModels/markupVisModel";
import { IESMetricVis } from "../elasticsearchModels/metricVisModel";
import { IESPlotVis } from "../elasticsearchModels/plotVisModel";
import { IESVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";

/**
 * A Manager class to control the building of visualization JSON objects and their starage
 * in the Elasticsearch cluster.
 */
export class VisualizationManager {
    private visualizationBuilder: VisualizationBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.visualizationBuilder = new VisualizationBuilder();
    }

    /**
     * Creates and saves a Markup visualization to Elasticsearch
     * @param id 
     * @param name 
     */
    public createMarkupVis(id: string, name: string) {
        const markupSeed: IESMarkupVis = {
            _id: id + "_markdown",
            type: "markdown",
            explorerTitle: name,
            displayText: name
        };

        const visualization: IESVisualization = {
            _id: markupSeed._id,
            type: markupSeed.type
        };

        try {
            this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getMarkup(markupSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }

    /**
     * Creates and saves a Bar Chart visualization to Elasticsearch
     * @param id 
     * @param operationName 
     * @param metricColumn 
     * @param featureColumn 
     * @param indexPatternId 
     */
    public createBarChartVis(id: string, operationName: string, metricColumn: string, featureColumn: string, indexPatternId: string) {
        const barChartSeed: IESBarChartVis = {
            _id: id + "_bar",
            type: "bar",
            explorerTitle: featureColumn + " by " + metricColumn + " by " + operationName,
            operationName: operationName,
            featureColumn: featureColumn,
            metricColumn: metricColumn,
            index: indexPatternId
        };

        const visualization: IESVisualization = {
            _id: barChartSeed._id,
            type: barChartSeed.type
        };

        try { 
            this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getBarChart(barChartSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }

    /**
     * Creates and saves a Metric visualization to Elasticsearch
     * @param id 
     * @param operationName 
     * @param indexPatternId 
     */
    public createMetricVis(id: string, operationName: string, indexPatternId: string) {
        const metricSeed: IESMetricVis = {
            _id: id + "_metric",
            type: "metric",
            explorerTitle: "Metric " + operationName,
            operationName: operationName,
            index: indexPatternId
        };

        const visualization: IESVisualization = {
            _id: metricSeed._id,
            type: metricSeed.type
        };

        try {
            this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getMetric(metricSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }

    /**
     * Creates and saves a Data Table visualization to Elasticsearch
     * @param id 
     * @param aggregationName 
     * @param operations 
     * @param featureColumns 
     * @param indexPatternId 
     */
    public createDataTableVis(id: string, aggregationName: string, operations: Array<string>, featureColumns: Array<string>, indexPatternId: string) {
        const dataTableSeed: IESDataTableVis = {
            _id: id + "_table",
            type: "table",
            explorerTitle: aggregationName + " table",
            operations: operations,
            featureColumns: featureColumns,
            index: indexPatternId
        };

        const visualization: IESVisualization = {
            _id: dataTableSeed._id,
            type: dataTableSeed.type
        };

        try {
            this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getDataTable(dataTableSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }

    /**
     * Creates and saves a Plot visualization to Elasticsearch
     * @param id 
     * @param index 
     * @param identifier 
     * @param identifierType 
     * @param xAxis 
     * @param xType 
     * @param yAxis 
     * @param yType 
     */
    public createPlotVis(id: string, index: string, identifier: string, identifierType: string, xAxis: string, xType: string, yAxis: string, yType: string) {
        const plotSeed: IESPlotVis = {
            _id: id + "_plot",
            type: "plot",
            index: index,
            explorerTitle: xAxis + " by " + yAxis + " plot",
            identifier: identifier,
            identifierType: identifierType,
            xAxis: xAxis,
            xType: xType,
            yAxis: yAxis,
            yType: yType
        };

        const visualization: IESVisualization = {
            _id: plotSeed._id,
            type: plotSeed.type
        };

        try {
            this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getVegaPlot(plotSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }

    /**
     * Creates and saves a Cluster visualization to Elasticsearch
     * @param id 
     * @param index 
     * @param identifier 
     * @param identifierType 
     * @param xAxis 
     * @param xType 
     * @param yAxis 
     * @param yType 
     */
    public createClusterVis(id: string, index: string, identifier: string, identifierType: string, xAxis: string, xType: string, yAxis: string, yType: string) {
        const clusterSeed: IESClusterVis = {
            _id: id + "_cluster",
            type: "cluster",
            index: index,
            explorerTitle: xAxis + " by " + yAxis + " cluster plot",
            identifier: identifier,
            identifierType: identifierType,
            xAxis: xAxis.toLowerCase(),
            xType: xType,
            yAxis: yAxis.toLowerCase(),
            yType: yType
        };

        const visualization: IESVisualization = {
            _id: clusterSeed._id,
            type: clusterSeed.type
        };

        try {
            this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getVegaCluster(clusterSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }
}