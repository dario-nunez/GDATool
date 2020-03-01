import { Inject } from "typescript-ioc";
import { GET, Path, PathParam } from "typescript-rest";
import { DashboardManager } from "../elasticsearchEntityManagers/dashboardManager";
import { IndexPatternManager } from "../elasticsearchEntityManagers/indexPatternManager";
import { VisualizationManager } from "../elasticsearchEntityManagers/visualizationManager";
import { IESVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";
import { MongodbService } from "../services/mongodb-service";

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

    @Path("status")
    @GET
    public status(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("listening :)");
        });
    }

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
            plotSection.push(this.visualizationManager.createVisMarkup(job._id, "General plots"));
        }

        // Plots
        for (const plot of plots) {
            plotSection.push(this.visualizationManager.createPlot(plot._id, plot._id, plot.identifier, plot.identifierType, plot.xAxis, plot.xType, plot.yAxis, plot.yType));
        }

        // Add Plot section
        visualizationsForDashboard.push(plotSection);

        // Aggregation section
        for (const aggregation of aggregations) {
            const aggSection = [];
            this.indexPatterManager.createIndexPattern(aggregation._id, aggregation.aggs, aggregation.featureColumns);
            const visualizationIdPrefix = aggregation.jobId + "_" + aggregation._id;

            // Title
            aggSection.push(this.visualizationManager.createVisMarkup(visualizationIdPrefix, aggregation.name));

            // Metrics
            for (const agg of aggregation.aggs) {
                aggSection.push(this.visualizationManager.createMetric(visualizationIdPrefix + agg.toLowerCase(), agg.toLowerCase(), aggregation._id));
            }

            // Bar charts
            for (const agg of aggregation.aggs) {                
                aggSection.push(this.visualizationManager.createVisBarChart(visualizationIdPrefix + "_" + agg.toLowerCase(), agg.toLowerCase(), aggregation.metricColumn, aggregation.featureColumns[0], aggregation._id));
            }

            // Data tables
            aggSection.push(this.visualizationManager.createDataTable(visualizationIdPrefix, aggregation.name , aggregation.aggs, aggregation.featureColumns, aggregation._id));

            // Clusters
            const clusters = await this.mongodbService.getClustersByAgg(aggregation._id);
            for (const cluster of clusters) {
                aggSection.push(this.visualizationManager.createCluster(aggregation._id + "_" + cluster._id, cluster._id, cluster.identifier, cluster.identifierType, cluster.xAxis, cluster.xType, cluster.yAxis, cluster.yType));
            }

            // Add a visualisation section
            visualizationsForDashboard.push(aggSection);
        }

        const returnDash = this.dashboardManager.createDashboard(job._id, visualizationsForDashboard);
        return returnDash;
    }
}
