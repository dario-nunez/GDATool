import { Inject } from "typescript-ioc";
import { DashboardBuilder } from "../elasticsearchEntityJsonBuilders/dashboardBuilder";
import { IESDashboard } from "../elasticsearchModels/dashboardModel";
import { IESVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";

export class DashboardManager {
    private dashboardBuilder: DashboardBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.dashboardBuilder = new DashboardBuilder();
    }

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