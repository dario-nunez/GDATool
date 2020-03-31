import { Inject } from "typescript-ioc";
import { GET, Path, PathParam } from "typescript-rest";
import { DashboardManager } from "../elasticsearchEntityManagers/dashboardManager";
import { IndexPatternManager } from "../elasticsearchEntityManagers/indexPatternManager";
import { VisualizationManager } from "../elasticsearchEntityManagers/visualizationManager";
import { IESVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";
import { MongodbService } from "../services/mongodb-service";

/**
 * Dashboard Builder endpoints rooted at "/es/dashboardBuilder".
 */
@Path("/es/dashboardBuilder")
export class DashboardBuilderController {
    private dashboardManager: DashboardManager;
    private indexPatterManager: IndexPatternManager;
    private visualizationManager: VisualizationManager;

    public constructor(@Inject private kibanaService: KibanaService, @Inject private mongodbService: MongodbService) {
        this.dashboardManager = new DashboardManager(this.kibanaService);
        this.indexPatterManager = new IndexPatternManager(this.kibanaService);
        this.visualizationManager = new VisualizationManager(this.kibanaService);
    }

    /**
     * Status check endpoint to verify the API is running and listening.
     */
    @Path("status")
    @GET
    public status(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("listening :)");
        });
    }

    /**
     * Create a dashboard of the "basic" type. This involves creating certain visualizations and adding
     * them to a dashboard object in a particular order and layout.
     * @param jobId 
     */
    @Path("basic/:id")
    @GET
    public async createBasicDashboard(@PathParam("id") jobId: string) {
        const plots = await this.mongodbService.getPlotsByJob(jobId);
        const aggregations = await this.mongodbService.getAggsByJob(jobId);
        const job = await this.mongodbService.getJobById(jobId);

        const visualizationsForDashboard = new Array();
        const plotSection: Array<IESVisualization> = new Array();

        // Plot section title
        if (plots.length > 0) {
            plotSection.push(this.visualizationManager.createMarkupVis(job._id, "General plots"));
        }

        // Plots
        for (const plot of plots) {
            plotSection.push(this.visualizationManager.createPlotVis(plot._id, plot._id, plot.identifier, plot.identifierType, plot.xAxis, plot.xType, plot.yAxis, plot.yType));
        }

        // Add Plot section
        visualizationsForDashboard.push(plotSection);

        // Aggregation section
        for (const aggregation of aggregations) {
            const aggSection = [];
            this.indexPatterManager.createIndexPattern(aggregation._id, aggregation.operations, aggregation.featureColumns);
            const visualizationIdPrefix = aggregation.jobId + "_" + aggregation._id;

            // Title
            aggSection.push(this.visualizationManager.createMarkupVis(visualizationIdPrefix, aggregation.name));

            // Metrics
            for (const operation of aggregation.operations) {
                aggSection.push(this.visualizationManager.createMetricVis(visualizationIdPrefix + "_" + operation.toLowerCase(), operation.toLowerCase(), aggregation._id));
            }

            // Bar charts
            for (const operation of aggregation.operations) {                
                aggSection.push(this.visualizationManager.createBarChartVis(visualizationIdPrefix + "_" + operation.toLowerCase(), operation.toLowerCase(), aggregation.metricColumn, aggregation.featureColumns[0], aggregation._id));
            }

            // Data tables
            aggSection.push(this.visualizationManager.createDataTableVis(visualizationIdPrefix, aggregation.name , aggregation.operations, aggregation.featureColumns, aggregation._id));

            // Clusters
            const clusters = await this.mongodbService.getClustersByAgg(aggregation._id);
            for (const cluster of clusters) {
                aggSection.push(this.visualizationManager.createClusterVis(aggregation._id + "_" + cluster._id, cluster._id, cluster.identifier, cluster.identifierType, cluster.xAxis, cluster.xType, cluster.yAxis, cluster.yType));
            }

            // Add a visualisation section
            visualizationsForDashboard.push(aggSection);
        }

        const returnDash = this.dashboardManager.createDashboard(job._id, visualizationsForDashboard);
        return returnDash;
    }
}
