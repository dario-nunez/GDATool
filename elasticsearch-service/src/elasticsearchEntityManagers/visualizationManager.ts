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

    public async createVisMarkup(visualizationId: string, contentText: string) {
        const markupSeed: IVisMarkup = {
            id: visualizationId,
            type: "markdown",
            explorerTitle: visualizationId,
            displayTitle: contentText
        };

        const visualization: IVisualization = {
            id: markupSeed.id,
            type: markupSeed.type
        };

        try {
            // const response = 
            await this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getMarkup(markupSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }

    public async createVisBarChart(visualizationId: string, aggregationName: string, metricColumn: string, featureColumn: string, indexPatternId: string) {
        const barChartSeed: IVisBarCHart = {
            id: visualizationId,
            type: "bar",
            explorerTitle: visualizationId,
            aggregationName: aggregationName,
            featureColumn: featureColumn,
            metricColumn: metricColumn,
            index: indexPatternId
        };

        try {
            const response = await this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getBarChart(barChartSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    public async createMetric(visualizationId: string, aggregationName: string, indexPatternId: string) {
        const metricSeed: IMetric = {
            id: visualizationId,
            type: "metric",
            explorerTitle: visualizationId,
            aggregationName: aggregationName,
            index: indexPatternId
        };

        try {
            const response = await this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getMetric(metricSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    public async createDataTable(visualizationId: string, aggregationName: string, operations: Array<string>, featureColumns: Array<string>, indexPatternId: string) {
        const dataTableSeed: IDataTable = {
            id: visualizationId,
            type: "table",
            explorerTitle: visualizationId,
            operations: operations,
            featureColumns: featureColumns,
            index: indexPatternId
        };

        try {
            const response = await this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getDataTable(dataTableSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    public async createPlot(id: string, index: string, identifier: string, identifierType: string, xAxis: string, xType: string, yAxis: string, yType: string): Promise<IVisualization> {
        const plotSeed: IPlot = {
            id: id,
            type: "vega",
            index: index,
            explorerTitle: id,
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
            // const response = 
            await this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getVegaPlot(plotSeed));
            return visualization;
        } catch (error) {
            return error;
        }
    }

    public async createCluster(id: string, index: string, identifier: string, identifierType: string, xAxis: string, xType: string, yAxis: string, yType: string) {
        const clusterSeed: ICluster = {
            id: id,
            type: "cluster",
            index: index,
            explorerTitle: id,
            identifier: identifier,
            identifierType: identifierType,
            xAxis: xAxis.toLowerCase(),
            xType: xType,
            yAxis: yAxis.toLowerCase(),
            yType: yType,
            cluster: 0
        };

        try {
            const response = await this.kibanaService.createElasticsearchEntity(this.visualizationBuilder.getVegaCluster(clusterSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }
}