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
import { DashboardController } from "./dashboardController";
import { IndexPatternController } from "./indexPatternController";
import { VisualizationController } from "./visualizationController";

/**
 * This class encapsulates the process of building the various types of dashboards.
 * To do so, it uses the single entity endpoints defined in the other classes in
 * the 'controllers' directory. (Basic, Regular, Advanced)
 */
@Path("/es/dashboardBuilder")
export class DashboardBuilderController {
    private visualizationController: VisualizationController;
    private indexPatternController: IndexPatternController;
    private dashboardController: DashboardController;

    public constructor(@Inject kibanaService: KibanaService, @Inject private mongodbService: MongodbService) {
        this.visualizationController = new VisualizationController(kibanaService);
        this.indexPatternController = new IndexPatternController(kibanaService);
        this.dashboardController = new DashboardController(kibanaService);
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
            this.createIndexPattern(aggregation._id, aggregation.aggs, aggregation.featureColumns);

            const visualizationIdPrefix = aggregation.jobId + "_" + aggregation._id;

            this.createVisMarkup(visualizationIdPrefix + "_markdown", aggregation.name);
            const visualizationMarkup: IVisualization = {
                id: visualizationIdPrefix,
                type: "markdown"
            };
            visualizationsForDashboard.push(visualizationMarkup);

            this.createVisBarChart(visualizationIdPrefix + "_bar", aggregation.featureColumns[0], aggregation._id);
            const visualizationBarChart: IVisualization = {
                id: visualizationIdPrefix,
                type: "bar"
            };
            visualizationsForDashboard.push(visualizationBarChart);
        });

        this.createDashboard(dashboardSeed.job._id, visualizationsForDashboard);

        return dashboardSeed;
    }

    private createIndexPattern(aggregationId: string, aggregations: Array<string>, featureColumns: Array<string>) {
        const indexPattern: IIndexPattern = {
            id: aggregationId,
            index: aggregationId,
            featureColumns,
            aggs: aggregations.map((e) => e.toLowerCase())
        };

        return this.indexPatternController.createIndexPattern(indexPattern);
    }

    private createVisMarkup(visualizationId: string, contentText: string) {
        const visualizationMarkup: IVisMarkup = {
            id: visualizationId,
            type: "markdown",
            explorerTitle: visualizationId,
            displayTitle: contentText
        };

        return this.visualizationController.createMarkupVisualization(visualizationMarkup);
    }

    private createVisBarChart(visualizationId: string, featureColumn: string, indexPatternId: string) {
        const visualizationBarChart: IVisBarCHart = {
            id: visualizationId,
            type: "bar",
            explorerTitle: visualizationId,
            featureColumn,
            index: indexPatternId
        };

        return this.visualizationController.createBarChartVisualization(visualizationBarChart);
    }

    private createDashboard(jobId: string, visualizations: Array<IVisualization>) {
        const dashboard: IDashboard = {
            id: jobId,
            title: jobId,
            visualizations,
            description: "This is a dashboard description"
        };

        return this.dashboardController.createSimpleDashboard(dashboard);
    }
}
