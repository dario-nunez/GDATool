import logger from "../../../common-service/src/logger/loggerFactory";
import { Inject } from "typescript-ioc";
import { GET, Path, PathParam } from "typescript-rest";
import { IAggregation } from "../../../common-service/src/models/aggregationModel";
import { IDashboard } from "../elasticsearchModels/dashboardModel";
import { IDashboardSeed } from "../elasticsearchModels/dashboardSeedModel";
import { IIndexPattern } from "../elasticsearchModels/indexPatternModel";
import { IVisBarCHart } from "../elasticsearchModels/visBarChartModel";
import { IVisMarkup } from "../elasticsearchModels/visMarkupModel";
import { IVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";
import { MongodbService } from "../services/mongodb-service";
import { IndexPatternBuilder } from "../elasticsearchEntities/indexPatternBuilder";
import { VisualizationBuilder } from "../elasticsearchEntities/visualizationBuilder";
import { DashboardBuilder } from "../elasticsearchEntities/DashboardBuilder";

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
        const aggregations = await this.mongodbService.getAggsByJob(jobId);
        const job = await this.mongodbService.getJobById(jobId);

        const dashboardSeed: IDashboardSeed = {
            job: job.data,
            aggregations: aggregations.data
        };

        logger.info("Dashboard seed");
        logger.info(dashboardSeed);

        const visualizationsForDashboard = new Array();

        dashboardSeed.aggregations.forEach((aggregation: IAggregation) => {
            let aggSection = [];
            this.createIndexPattern(aggregation._id, aggregation.aggs, aggregation.featureColumns);

            const visualizationIdPrefix = aggregation.jobId + "_" + aggregation._id;

            //Title
            this.createVisMarkup(visualizationIdPrefix + "_markdown", aggregation.name);
            const visualizationMarkup: IVisualization = {
                id: visualizationIdPrefix,
                type: "markdown"
            };
            aggSection.push(visualizationMarkup);

            //BarCharts
            this.createVisBarChart(visualizationIdPrefix + "_bar", aggregation.featureColumns[0], aggregation._id);
            const visualizationBarChart: IVisualization = {
                id: visualizationIdPrefix,
                type: "bar"
            };
            aggSection.push(visualizationBarChart);
            aggSection.push(visualizationBarChart);

            //Adding the visualization section of this aggregation to the list of all visualizations
            visualizationsForDashboard.push(aggSection);
        });

        this.createDashboard(dashboardSeed.job._id, visualizationsForDashboard);

        return dashboardSeed;
    }

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

    private async createVisBarChart(visualizationId: string, featureColumn: string, indexPatternId: string) {
        const barChartSeed: IVisBarCHart = {
            id: visualizationId,
            type: "bar",
            explorerTitle: visualizationId,
            featureColumn,
            index: indexPatternId
        };

        try {
            const response = await this.kibanaService.createBarChartVisualization(this.visualizationBuilder.getBarChart(barChartSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    private async createDashboard(jobId: string, visualizations: Array<Array<IVisualization>>) {
        const dashboardSeed: IDashboard = {
            id: jobId,
            title: jobId,
            visualizations,
            description: "This is a dashboard description"
        };

        try {
            const response = await this.kibanaService.createSimpleDashbaord(this.dashboardBuilder.getDashboard(dashboardSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }
}
