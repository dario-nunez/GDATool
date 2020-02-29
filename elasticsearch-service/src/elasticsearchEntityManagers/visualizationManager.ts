import { Inject } from "typescript-ioc";
import { VisualizationBuilder } from "../elasticsearchEntityJsonBuilders/visualizationBuilder";
import { ICluster } from "../elasticsearchModels/clusterModel";
import { IDataTable } from "../elasticsearchModels/dataTableModel";
import { IMetric } from "../elasticsearchModels/metricModel";
import { IPlot } from "../elasticsearchModels/plotModel";
import { IVisBarCHart } from "../elasticsearchModels/visBarChartModel";
import { IVisMarkup } from "../elasticsearchModels/visMarkupModel";
import { IVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";

export class VisualizationManager {
    private visualizationBuilder: VisualizationBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.visualizationBuilder = new VisualizationBuilder();
    }

    public createVisMarkup(id: string, name: string) {
        const markupSeed: IVisMarkup = {
            id: id + "_markdown",
            type: "markdown",
            explorerTitle: name,
            displayText: name
        };

        const visualization: IVisualization = {
            id: markupSeed.id,
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
        const barChartSeed: IVisBarCHart = {
            id: id + "_bar",
            type: "bar",
            explorerTitle: featureColumn + " by " + metricColumn + " by " + aggregationName,
            aggregationName: aggregationName,
            featureColumn: featureColumn,
            metricColumn: metricColumn,
            index: indexPatternId
        };

        const visualization: IVisualization = {
            id: barChartSeed.id,
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
        const metricSeed: IMetric = {
            id: id + "_metric",
            type: "metric",
            explorerTitle: aggregationName,
            aggregationName: aggregationName,
            index: indexPatternId
        };

        const visualization: IVisualization = {
            id: metricSeed.id,
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
        const dataTableSeed: IDataTable = {
            id: id + "_table",
            type: "table",
            explorerTitle: aggregationName + " table",
            operations: operations,
            featureColumns: featureColumns,
            index: indexPatternId
        };

        const visualization: IVisualization = {
            id: dataTableSeed.id,
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
        const plotSeed: IPlot = {
            id: id + "_plot",
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

        const visualization: IVisualization = {
            id: plotSeed.id,
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
        const clusterSeed: ICluster = {
            id: id + "_cluster",
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

        const visualization: IVisualization = {
            id: clusterSeed.id,
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