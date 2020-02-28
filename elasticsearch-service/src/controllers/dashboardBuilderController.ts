import { Inject } from "typescript-ioc";
import { GET, Path, PathParam } from "typescript-rest";
import logger from "../../../mongodb-service/src/logger/loggerFactory";
import { IAggregation } from "../../../mongodb-service/src/models/aggregationModel";
import { DashboardManager } from "../elasticsearchEntityManagers/dashboardManager";
import { IndexPatternManager } from "../elasticsearchEntityManagers/indexPatternManager";
import { VisualizationManager } from "../elasticsearchEntityManagers/visualizationManager";
import { ICluster } from "../elasticsearchModels/clusterModel";
import { IVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";
import { MongodbService } from "../services/mongodb-service";

@Path("/es/dashboardBuilder")
export class DashboardBuilderController {
    private dashboardManager: DashboardManager;
    private indexPatterManager:IndexPatternManager;
    private visualizationManager:VisualizationManager;

    public constructor(@Inject private kibanaService: KibanaService, @Inject private mongodbService: MongodbService) {
        this.dashboardManager = new DashboardManager(this.kibanaService);
        this.indexPatterManager = new IndexPatternManager(this.kibanaService);
        this.visualizationManager = new VisualizationManager(this.kibanaService);
    }

    @Path("test/:name")
    @GET
    public sayHello(@PathParam("name") name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("Hello " + name);
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
        // Add a title to the general plots section
        if (plots.data.length > 0) {
            this.visualizationManager.createVisMarkup(job.data._id + "_general_plots", "general_plots_title");
            const visualizationMarkup: IVisualization = {
                id: job.data._id + "_general_plots",
                type: "markdown"
            };
            
            plotSection.push(visualizationMarkup);
        }

        // For each plot, add it to the tpo of the dashboard
        for (const plot of plots.data) {
            // this.visualizationManager.createPlot(plot._id + "_plot", plot._id, plot.identifier, plot.identifierType, plot.xAxis, plot.xType, plot.yAxis, plot.yType);

            // const visualizationPlot: IVisualization = {
            //     id: plot._id + "_plot",
            //     type: "vega"
            // };

            plotSection.push(await this.visualizationManager.createPlot(plot._id + "_plot", plot._id, plot.identifier, plot.identifierType, plot.xAxis, plot.xType, plot.yAxis, plot.yType));
        }

        visualizationsForDashboard.push(plotSection);
        
        // Get all clusters from the aggregations
        const aggregationsData = aggregations.data;
        const aggClusters: {[aggId: string] : Array<ICluster>} = {};
        for (const aggregation of aggregationsData){
            const aggID = aggregation._id;
            logger.info("Agg ID: " + aggID);
            const clusters = await this.mongodbService.getClustersByAgg(aggID);
            const clustersData = clusters.data;
            aggClusters[aggID] = clustersData;
            logger.info("Agg's clusters: ");
            logger.info(clustersData);
        }
        logger.info(aggClusters);

        // For each aggregation, generate it dashboard section
        aggregations.data.forEach((aggregation: IAggregation) => {
            logger.info("----SECOND LOOP STARTED----");
            // Holds the aggregation/dashboard section for each aggregation
            const aggSection = [];

            this.indexPatterManager.createIndexPattern(aggregation._id, aggregation.aggs, aggregation.featureColumns);

            const visualizationIdPrefix = aggregation.jobId + "_" + aggregation._id;

            // Title
            this.visualizationManager.createVisMarkup(visualizationIdPrefix + "_markdown", aggregation.name);
            const visualizationMarkup: IVisualization = {
                id: visualizationIdPrefix + "_markdown",
                type: "markdown"
            };
            aggSection.push(visualizationMarkup);

            // Metrics   - one for each agg. Currently avg is beign hardcoded
            for (const agg of aggregation.aggs) {
                this.visualizationManager.createMetric(visualizationIdPrefix + "_metric_" + agg.toLowerCase(), agg.toLowerCase(), aggregation._id);
                const visualizationMetric: IVisualization = {
                    id: visualizationIdPrefix + "_metric_" + agg.toLowerCase(),
                    type: "metric"
                };
                aggSection.push(visualizationMetric);
            }

            // BarCharts - one for each agg (operation)
            for (const agg of aggregation.aggs) {
                this.visualizationManager.createVisBarChart(visualizationIdPrefix + "_bar_" + agg.toLowerCase(), agg.toLowerCase(), aggregation.metricColumn, aggregation.featureColumns[0], aggregation._id);
                const visualizationBarChart: IVisualization = {
                    id: visualizationIdPrefix + "_bar_" + agg.toLowerCase(),
                    type: "bar"
                };
                aggSection.push(visualizationBarChart);
            }

            // DataTables - one per aggregation record
            this.visualizationManager.createDataTable(visualizationIdPrefix + "_table", aggregation.metricColumn, aggregation.aggs, aggregation.featureColumns, aggregation._id);
            const visualizationDataTable: IVisualization = {
                id: visualizationIdPrefix + "_table",
                type: "table"
            };
            aggSection.push(visualizationDataTable);

            // Clusters - n clusters stacked at the bottom of the aggregation section
            aggClusters[aggregation._id].forEach((cluster: any) => {
                this.visualizationManager.createCluster(aggregation._id + "_" + cluster._id + "_cluster", cluster._id, cluster.identifier, cluster.identifierType, cluster.xAxis, cluster.xType, cluster.yAxis, cluster.yType);
                const visualizationCluster: IVisualization = {
                    id: aggregation._id + "_" + cluster._id + "_cluster",
                    type: "cluster"
                };

                aggSection.push(visualizationCluster);
            });

            // Adding the visualization section of this aggregation to the list of all visualizations
            visualizationsForDashboard.push(aggSection);
        });

        this.dashboardManager.createDashboard(job.data._id, visualizationsForDashboard);

        // this.createDashboard(job.data._id, visualizationsForDashboard);

        // return dashboardSeed;
    }
}
