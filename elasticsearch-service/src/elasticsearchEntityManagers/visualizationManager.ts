import { Inject } from "typescript-ioc";
import { VisualizationBuilder } from "../elasticsearchEntityJsonBuilders/visualizationBuilder";
import { IESCluster } from "../elasticsearchModels/clusterModel";
import { IESDataTable } from "../elasticsearchModels/dataTableModel";
import { IESMetric } from "../elasticsearchModels/metricModel";
import { IESPlot } from "../elasticsearchModels/plotModel";
import { IESBarChart } from "../elasticsearchModels/visBarChartModel";
import { IESMarkup } from "../elasticsearchModels/visMarkupModel";
import { IESVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";

export class VisualizationManager {
    private visualizationBuilder: VisualizationBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.visualizationBuilder = new VisualizationBuilder();
    }

    public createVisMarkup(id: string, name: string) {
        const markupSeed: IESMarkup = {
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

    public createVisBarChart(id: string, aggregationName: string, metricColumn: string, featureColumn: string, indexPatternId: string) {
        const barChartSeed: IESBarChart = {
            _id: id + "_bar",
            type: "bar",
            explorerTitle: featureColumn + " by " + metricColumn + " by " + aggregationName,
            aggregationName: aggregationName,
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

    public createMetric(id: string, aggregationName: string, indexPatternId: string) {
        const metricSeed: IESMetric = {
            _id: id + "_metric",
            type: "metric",
            explorerTitle: aggregationName,
            aggregationName: aggregationName,
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

    public createDataTable(id: string, aggregationName: string, operations: Array<string>, featureColumns: Array<string>, indexPatternId: string) {
        const dataTableSeed: IESDataTable = {
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

    public createPlot(id: string, index: string, identifier: string, identifierType: string, xAxis: string, xType: string, yAxis: string, yType: string) {
        const plotSeed: IESPlot = {
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

    public createCluster(id: string, index: string, identifier: string, identifierType: string, xAxis: string, xType: string, yAxis: string, yType: string) {
        const clusterSeed: IESCluster = {
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