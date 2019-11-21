import logger from "../../../common-service/src/logger/loggerFactory";
import { Inject } from "typescript-ioc";
import { GET, Path, PathParam, PUT } from "typescript-rest";
import { IDashboard } from "../elasticsearchModels/dashboardModel";
import { KibanaService } from "../services/kibana-service";
import { ElasticServiceBaseController } from "./elasticServerBaseController";

@Path("/es/dashboard")
export class DashboardController extends ElasticServiceBaseController {

    constructor(@Inject private kibanaService: KibanaService) {
        super();
    }

    @Path("test/:name")
    @GET
    public sayHello(@PathParam("name") name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("Hello " + name);
        });
    }

    /**
     * Creates a new dashbaord.
     * @param newDashboard The dashboard object to be created and stored in the database.
     */
    @PUT
    public async createSimpleDashboard(newDashboard: IDashboard): Promise<any> {
        logger.info("Create simple dashboard: ");
        logger.info(newDashboard);
        const dashboardJSON = this.getDashbaordJSON(newDashboard);

        try {
            const response = await this.kibanaService.createSimpleDashbaord(dashboardJSON);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    public getDashbaordJSON(newDashboard: IDashboard) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/dashboard:" + newDashboard.id + "_dashboard",
            data:
            {
                dashboard:
                {
                    title: newDashboard.title + "_dashboard",
                    hits: 0,
                    description: "",
                    panelsJSON: this.getVisualizationMetadata(newDashboard),
                    optionsJSON: '{"useMargins":true,"hidePanelTitles":false}',
                    version: 1,
                    timeRestore: false,
                    kibanaSavedObjectMeta: { searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[]}' }
                },
                type: "dashboard",
                references: this.getReferences(newDashboard),
                migrationVersion: {
                    dashboard: "7.3.0"
                },
                updated_at: "2019-07-04T16:35:09.831Z"
            }
        };
    }

    private getReferences(newDashboard: IDashboard) {
        let panelCounter = 0;
        const referenceArray: Array<any> = [];

        for (const vis of newDashboard.visualizations) {
            referenceArray.push({
                name: "panel_" + panelCounter,
                type: "visualization",
                id: vis.id + "_" + vis.type
            });

            panelCounter = panelCounter + 1;
        }
        return referenceArray;
    }

    private getVisualizationMetadata(newDashboard: IDashboard): string {
        const markdownVisHeight: number = 5;
        const barVisHeight: number = 16;
        let panelIndex: number = 0;
        let currentY: number = 0;
        let panelCounter = 0;
        let visualizationMetadata = "[";

        for (const vis of newDashboard.visualizations) {
            let visHeight = 0;

            if (vis.type === "markdown") {
                visHeight = markdownVisHeight;
            } else {
                visHeight = barVisHeight;
            }

            visualizationMetadata = visualizationMetadata + '{"gridData":{"w":48,"h":' + visHeight + ',"x":0,"y":' + currentY + ',"i":"' + panelIndex + '"},"version":"7.3.0","panelIndex":"' + panelIndex + '","embeddableConfig":{},"panelRefName":"panel_' + panelCounter + '"},';

            currentY = currentY + visHeight;
            panelIndex = panelIndex + 1;
            panelCounter = panelCounter + 1;
        }

        visualizationMetadata = visualizationMetadata.substring(0, visualizationMetadata.length - 1) + "]";

        return visualizationMetadata;
    }
}
