import { Inject } from "typescript-ioc";
import { DashboardBuilder } from "../elasticsearchEntityJsonBuilders/dashboardBuilder";
import { IDashboard } from "../elasticsearchModels/dashboardModel";
import { IVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";

export class DashboardManager {
    private dashboardBuilder: DashboardBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.dashboardBuilder = new DashboardBuilder();
    }

    public  createDashboard(jobId: string, visualizations: Array<Array<IVisualization>>) {
        const dashboardSeed: IDashboard = {
            id: jobId,
            title: jobId,
            visualizations: visualizations,
            description: "This is a dashboard description"
        };    

        try {
            this.kibanaService.createElasticsearchEntity(this.dashboardBuilder.getDashboard(dashboardSeed));
            return dashboardSeed;
        } catch (error) {
            return error;
        }
    }
}