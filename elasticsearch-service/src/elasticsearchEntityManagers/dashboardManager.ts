import { Inject } from "typescript-ioc";
import { DashboardBuilder } from "../elasticsearchEntityJsonBuilders/dashboardBuilder";
import { IESDashboard } from "../elasticsearchModels/dashboardModel";
import { IESVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";

/**
 * A Manager class to control the building of Dashboard JSON objects and their starage
 * in the Elasticsearch cluster.
 */
export class DashboardManager {
    private dashboardBuilder: DashboardBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.dashboardBuilder = new DashboardBuilder();
    }

    /**
     * Creates and saves a Dashboard to Elasticsearch 
     * @param jobId 
     * @param visualizations 
     */
    public  createDashboard(jobId: string, visualizations: Array<Array<IESVisualization>>) {
        const dashboardSeed: IESDashboard = {
            _id: jobId,
            title: jobId,
            visualizations: visualizations,
            description: "This is a dashboard description"
        };    

        try {
            this.kibanaService.createElasticsearchEntity(this.dashboardBuilder.getBasicDashboard(dashboardSeed));
            return dashboardSeed;
        } catch (error) {
            return error;
        }
    }
}