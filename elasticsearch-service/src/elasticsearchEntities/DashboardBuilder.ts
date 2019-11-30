import { IDashboard } from "../elasticsearchModels/dashboardModel";
import logger from "../../../common-service/src/logger/loggerFactory";

export class DashboardBuilder {
    protected elasticSearchUrl: string;
    protected indexName: string;

    //private FONT_SIZE: number = 30;
    private TITLE_HEIGHT: number = 5;
    //private BADGE_HEIGHT: number = 5;
    private BAR_CHART_HEIGHT: number = 16;
    private MAX_WIDTH: number = 48;
    private HALF_WIDTH: number = 24;

    constructor() {
        this.elasticSearchUrl = "http://localhost:9200/";
        this.indexName = ".kibana/";
    }

    public getDashboard(dashboardModel: IDashboard) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/dashboard:" + dashboardModel.id + "_dashboard",
            data:
            {
                dashboard:
                {
                    title: dashboardModel.title + "_dashboard",
                    hits: 0,
                    description: "",
                    panelsJSON: this.getVisualizationMetadata(dashboardModel),
                    optionsJSON: '{"useMargins":true,"hidePanelTitles":false}',
                    version: 1,
                    timeRestore: false,
                    kibanaSavedObjectMeta: { searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[]}' }
                },
                type: "dashboard",
                references: this.getReferences(dashboardModel),
                migrationVersion: {
                    dashboard: "7.3.0"
                },
                updated_at: "2019-07-04T16:35:09.831Z"
            }
        };
    }

    private getReferences(dashboardModel: IDashboard) {
        let panelCounter = 0;
        const referenceArray: Array<any> = [];

        for (const visArray of dashboardModel.visualizations) {
            for (const vis of visArray) {
                referenceArray.push({
                    name: "panel_" + panelCounter,
                    type: "visualization",
                    id: vis.id + "_" + vis.type
                });

                panelCounter = panelCounter + 1;
            }
        }

        return referenceArray;
    }

    private getVisualizationMetadata(dashboardModel: IDashboard): string {
        let panelIndex: number = 0;
        let currentY: number = 0;
        let currentX: number = 0;
        let panelCounter = 0;
        let visualizationMetadata = "[";

        logger.info("=========== ALL_VISUALIZATIONS ===========");
        logger.info(dashboardModel.visualizations);

        for (const visArray of dashboardModel.visualizations) {
            let barCharts = new Array();

            for (const vis of visArray) {
                if (vis.type === "markdown") {
                    
                } else {
                    barCharts.push(vis);
                }
            }

            //Title
            visualizationMetadata = visualizationMetadata + this.generateGridData(this.TITLE_HEIGHT, this.MAX_WIDTH, currentX, currentY, panelIndex, panelCounter);
            currentY = currentY + this.TITLE_HEIGHT;
            panelIndex = panelIndex + 1;
            panelCounter = panelCounter + 1;

            //BarCharts
            for (let i: number = 0; i < barCharts.length; i++) {
                if (i % 2 == 0) {
                    logger.info("EVEN i = " + i);
                    logger.info("Current y: " + currentY);
                    logger.info("Current x: " + currentX);
                    visualizationMetadata = visualizationMetadata + this.generateGridData(this.BAR_CHART_HEIGHT, this.HALF_WIDTH, currentX, currentY, panelIndex, panelCounter);
                    currentX = currentX + this.HALF_WIDTH;
                    panelIndex = panelIndex + 1;
                    panelCounter = panelCounter + 1;

                    if (i == barCharts.length - 1) {
                        currentY = currentY + this.BAR_CHART_HEIGHT;
                        currentX = 0;
                    }
                } else {
                    logger.info("ODD i = " + i);
                    logger.info("Current y: " + currentY);
                    logger.info("Current x: " + currentX);
                    visualizationMetadata = visualizationMetadata + this.generateGridData(this.BAR_CHART_HEIGHT, this.HALF_WIDTH, currentX, currentY, panelIndex, panelCounter);
                    currentX = 0;
                    panelIndex = panelIndex + 1;
                    panelCounter = panelCounter + 1;
                    currentY = currentY + this.BAR_CHART_HEIGHT;
                }
            }
        }

        visualizationMetadata = visualizationMetadata.substring(0, visualizationMetadata.length - 1) + "]";

        return visualizationMetadata;
    }

    private generateGridData(height: number, width: number, x: number, y: number, panelIndex: number, panelCounter: number) {
        return '{"gridData":{"w":' + width + ',"h":' + height + ',"x":' + x + ',"y":' + y + ',"i":"' + panelIndex + '"},"version":"7.3.0","panelIndex":"' + panelIndex + '","embeddableConfig":{},"panelRefName":"panel_' + panelCounter + '"},';
    }
}