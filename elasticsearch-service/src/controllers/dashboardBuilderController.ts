import { Inject } from "typescript-ioc";
import { GET, Path, PathParam } from "typescript-rest";
import { DashboardManager } from "../elasticsearchEntityManagers/dashboardManager";
import { IndexPatternManager } from "../elasticsearchEntityManagers/indexPatternManager";
import { VisualizationManager } from "../elasticsearchEntityManagers/visualizationManager";
import { IVisualization } from "../elasticsearchModels/visualizationModel";
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
        const plotSection: Array<IVisualization> = [];

        // ------------------------- Add a title to the general plots section
        if (plots.data.length > 0) {
            plotSection.push(this.visualizationManager.createVisMarkup(job.data._id, "General plots"));
        }

        // ------------------------- For each plot, add it to the tpo of the dashboard
        for (const plot of plots.data) {
            plotSection.push(this.visualizationManager.createPlot(plot._id, plot._id, plot.identifier, plot.identifierType, plot.xAxis, plot.xType, plot.yAxis, plot.yType));
        }

        visualizationsForDashboard.push(plotSection);

        // For each aggregation, generate it dashboard section
        for (const aggregation of aggregations.data) {
            // Holds the aggregation/dashboard section for each aggregation
            const aggSection = [];

            this.indexPatterManager.createIndexPattern(aggregation._id, aggregation.aggs, aggregation.featureColumns);

            const visualizationIdPrefix = aggregation.jobId + "_" + aggregation._id;

            // ------------------------- Title
            aggSection.push(this.visualizationManager.createVisMarkup(visualizationIdPrefix, aggregation.name));

            // ------------------------- Metrics   - one for each agg. Currently avg is beign hardcoded
            for (const agg of aggregation.aggs) {
                aggSection.push(this.visualizationManager.createMetric(visualizationIdPrefix + agg.toLowerCase(), agg.toLowerCase(), aggregation._id));
            }

            // ------------------------- BarCharts - one for each agg (operation)
            for (const agg of aggregation.aggs) {                
                aggSection.push(this.visualizationManager.createVisBarChart(visualizationIdPrefix + "_" + agg.toLowerCase(), agg.toLowerCase(), aggregation.metricColumn, aggregation.featureColumns[0], aggregation._id));
            }

            // ------------------------- DataTables - one per aggregation record
            aggSection.push(this.visualizationManager.createDataTable(visualizationIdPrefix, aggregation.name , aggregation.aggs, aggregation.featureColumns, aggregation._id));

            // ------------------------- Clusters - n clusters stacked at the bottom of the agg section
            const clusters = await this.mongodbService.getClustersByAgg(aggregation._id);
            for (const cluster of clusters.data) {
                aggSection.push(this.visualizationManager.createCluster(aggregation._id + "_" + cluster._id, cluster._id, cluster.identifier, cluster.identifierType, cluster.xAxis, cluster.xType, cluster.yAxis, cluster.yType));
            }

            // Adding the visualization section of this aggregation to the list of all visualizations
            visualizationsForDashboard.push(aggSection);
        }

        const returnDash = this.dashboardManager.createDashboard(job.data._id, visualizationsForDashboard);
        return returnDash;
    }
}
