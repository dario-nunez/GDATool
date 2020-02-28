import { Inject } from "typescript-ioc";
import logger from "../../../mongodb-service/src/logger/loggerFactory";
import { DashboardBuilder } from "../elasticsearchEntityJsonBuilders/DashboardBuilder";
import { IDashboard } from "../elasticsearchModels/dashboardModel";
import { IVisualization } from "../elasticsearchModels/visualizationModel";
import { KibanaService } from "../services/kibana-service";

export class DashboardManager {
    private dashboardBuilder: DashboardBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.dashboardBuilder = new DashboardBuilder();
    }

    public async createDashboard(jobId: string, visualizations: Array<Array<IVisualization>>) {
        const dashboardSeed: IDashboard = {
            id: jobId,
            title: jobId,
            visualizations: visualizations,
            description: "This is a dashboard description"
        };

        logger.info("Dashboard seed");
        logger.info(dashboardSeed);

        try {
            const response = await this.kibanaService.createElasticsearchEntity(this.dashboardBuilder.getDashboard(dashboardSeed));
            return response.data;
        } catch (error) {
            return error;
        }
    }
}