import logger from "../../../common-service/src/logger/loggerFactory";
import { Inject } from "typescript-ioc";
import { GET, Path, PathParam } from "typescript-rest";
import { IAggregation } from "../../../common-service/src/models/aggregationModel";
import { IDashboard } from "../elasticsearchModels/dashboardModel";
import { IIndexPattern } from "../elasticsearchModels/indexPatternModel";
import { IVisBarCHart } from "../elasticsearchModels/visBarChartModel";
import { IVisMarkup } from "../elasticsearchModels/visMarkupModel";
import { IVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";
import { MongodbService } from "../services/mongodb-service";
import { IndexPatternBuilder } from "../elasticsearchEntities/indexPatternBuilder";
import { VisualizationBuilder } from "../elasticsearchEntities/visualizationBuilder";
import { DashboardBuilder } from "../elasticsearchEntities/DashboardBuilder";
import { IMetric } from "../elasticsearchModels/metricModel";
import { IDataTable } from "../elasticsearchModels/dataTableModel";
import { IPlot } from "../elasticsearchModels/plotModel";

/**
 * This class encapsulates the process of building the various types of dashboards.
 * To do so, it uses the single entity endpoints defined in the other classes in
 * the 'controllers' directory. (Basic, Regular, Advanced)
 */
@Path("/es/dashboardBuilder")
export class DashboardBuilderController {
    private indexPatternBuilder: IndexPatternBuilder;
    private visualizationBuilder: VisualizationBuilder;
    private dashboardBuilder: DashboardBuilder;

    public constructor(@Inject private kibanaService: KibanaService, @Inject private mongodbService: MongodbService) {
        this.indexPatternBuilder = new IndexPatternBuilder();
        this.visualizationBuilder = new VisualizationBuilder();
        this.dashboardBuilder = new DashboardBuilder();
    }

    @Path("test/:name")
    @GET
    public sayHello(@PathParam("name") name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("Hello " + name);
        });
    }

    /**
     * This endpoint triggers the building of a 'Basic' dashboard. It contains:
     * A markdown title for each aggregation
     * A bar chart for each aggregation
     * @param dashboardSeed Contains a list of aggregations and a job.
     */
    @Path("basic/:id")
    @GET
    public async createBasicDashboard(@PathParam("id") jobId: string) {
        let plots = await this.mongodbService.getPlotsByJob(jobId);
        const aggregations = await this.mongodbService.getAggsByJob(jobId);
        const job = await this.mongodbService.getJobById(jobId);

        const visualizationsForDashboard = new Array();

        let plotSection: IVisualization[] = [];
        //Add a title to the general plots section
        this.createVisMarkup(job.data._id + "_general_plots", "general_plots_title");
        const visualizationMarkup: IVisualization = {
            id: job.data._id + "_general_plots",
            type: "markdown"
        };
        
        plotSection.push(visualizationMarkup);

        // For each plot, add it to the tpo of the dashboard
        plots.data.forEach((plot: any) => {
            this.createPlot(plot._id + "_plot", plot._id, plot.identifier, plot.identifierType, plot.xAxis, plot.xType, plot.yAxis, plot.yType);

            const visualizationPlot: IVisualization = {
                id: plot._id + "_plot",
                type: "vega"
            }

            plotSection.push(visualizationPlot)
        });

        visualizationsForDashboard.push(plotSection);

        // For each aggregation, generate it dashboard section
        aggregations.data.forEach((aggregation: IAggregation) => {
            // Holds the aggregation/dashboard section for each aggregation
            let aggSection = [];

            // Creates the index pattern for that aggreagtion
            this.createIndexPattern(aggregation._id, aggregation.aggs, aggregation.featureColumns);

            const visualizationIdPrefix = aggregation.jobId + "_" + aggregation._id;

            //Title
            this.createVisMarkup(visualizationIdPrefix + "_markdown", aggregation.name);
            const visualizationMarkup: IVisualization = {
                id: visualizationIdPrefix + "_markdown",
                type: "markdown"
            };
            aggSection.push(visualizationMarkup);

            //Metrics   - one for each agg. Currently avg is beign hardcoded
            for (const agg of aggregation.aggs) {
                this.createMetric(visualizationIdPrefix + "_metric_" + agg.toLowerCase(), agg.toLowerCase(), aggregation._id);
                const visualizationMetric: IVisualization = {
                    id: visualizationIdPrefix + "_metric_" + agg.toLowerCase(),
                    type: "metric"
                };
                aggSection.push(visualizationMetric);
            }

            //BarCharts - one for each agg (operation)
            for (const agg of aggregation.aggs) {
                this.createVisBarChart(visualizationIdPrefix + "_bar_" + agg.toLowerCase(), agg.toLowerCase(), aggregation.metricColumn, aggregation.featureColumns[0], aggregation._id);
                const visualizationBarChart: IVisualization = {
                    id: visualizationIdPrefix + "_bar_" + agg.toLowerCase(),
                    type: "bar"
                };
                aggSection.push(visualizationBarChart);
            }

            //DataTables - one per aggregation record
            this.createDataTable(visualizationIdPrefix + "_table", aggregation.metricColumn, aggregation.aggs, aggregation.featureColumns, aggregation._id);
            const visualizationDataTable: IVisualization = {
                id: visualizationIdPrefix + "_table",
                type: "table"
            };
            aggSection.push(visualizationDataTable);

            //Adding the visualization section of this aggregation to the list of all visualizations
            visualizationsForDashboard.push(aggSection);
        });

        this.createDashboard(job.data._id, visualizationsForDashboard);

        // return dashboardSeed;
    }

    // Create an index pattern
    private async createIndexPattern(aggregationId: string, aggregations: Array<string>, featureColumns: Array<string>) {
        const indexPatternSeed: IIndexPattern = {
            id: aggregationId,
            index: aggregationId,
            featureColumns,
            aggs: aggregations.map((e) => e.toLowerCase())
        };

        try {
            const response = await this.kibanaService.createIndexPattern(this.indexPatternBuilder.getIndexPattern(indexPatternSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    // Create a markup visualization
    private async createVisMarkup(visualizationId: string, contentText: string) {
        const markupSeed: IVisMarkup = {
            id: visualizationId,
            type: "markdown",
            explorerTitle: visualizationId,
            displayTitle: contentText
        };

        try {
            const response = await this.kibanaService.createMarkupVisualization(this.visualizationBuilder.getMarkup(markupSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    // Create a bar chart visualization
    private async createVisBarChart(visualizationId: string, aggregationName: string, metricColumn: string, featureColumn: string, indexPatternId: string) {
        const barChartSeed: IVisBarCHart = {
            id: visualizationId,
            type: "bar",
            explorerTitle: visualizationId,
            aggregationName,
            featureColumn,
            metricColumn,
            index: indexPatternId
        };

        try {
            const response = await this.kibanaService.createBarChartVisualization(this.visualizationBuilder.getBarChart(barChartSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    // Create metric visualization
    private async createMetric(visualizationId: string, aggregationName: string, indexPatternId: string) {
        const metricSeed: IMetric = {
            id: visualizationId,
            type: "metric",
            explorerTitle: visualizationId,
            aggregationName,
            index: indexPatternId
        };

        try {
            const response = await this.kibanaService.createMetricVisualization(this.visualizationBuilder.getMetric(metricSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    // Create data table
    private async createDataTable(visualizationId: string, aggregationName: string, operations: string[], featureColumns: string[], indexPatternId: string) {
        const dataTableSeed: IDataTable = {
            id: visualizationId,
            type: "table",
            explorerTitle: visualizationId,
            operations: operations,
            featureColumns: featureColumns,
            index: indexPatternId
        }

        try {
            const response = await this.kibanaService.createDataTable(this.visualizationBuilder.getDataTable(dataTableSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    // Create plot
    private async createPlot(id: string, index: string, identifier: string, identifierType: string, xAxis: string, xType: string, yAxis: string, yType: string) {
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
        }

        logger.info("Plot seed")
        logger.info(plotSeed);

        try {
            const response = await this.kibanaService.createPlot(this.kibanaService.createPlot(this.visualizationBuilder.getVegaPlot(plotSeed)));
            logger.info(response.data)
            return response.data;
        } catch (error) {
            return error;
        }
    }

    // Create dashboard
    private async createDashboard(jobId: string, visualizations: Array<Array<IVisualization>>) {
        const dashboardSeed: IDashboard = {
            id: jobId,
            title: jobId,
            visualizations,
            description: "This is a dashboard description"
        };

        logger.info("Dashboard seed")
        logger.info(dashboardSeed)

        try {
            const response = await this.kibanaService.createSimpleDashbaord(this.dashboardBuilder.getDashboard(dashboardSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }
}
