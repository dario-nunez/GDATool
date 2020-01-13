import { IDashboard } from "../elasticsearchModels/dashboardModel";

export class DashboardBuilder {
    protected elasticSearchUrl: string;
    protected indexName: string;

    private TITLE_HEIGHT: number = 5;
    private BADGE_HEIGHT: number = 6;
    private QUARTER_WIDTH: number = 12;
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
                    id: vis.id
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

        for (const visArray of dashboardModel.visualizations) {
            let barCharts = new Array();
            let metrics = new Array();

            for (const vis of visArray) {
                if (vis.type === "metric") {
                    metrics.push(vis);
                } else if (vis.type === "bar") {
                    barCharts.push(vis);
                } else {
                    //title here...
                }
            }

            //Title
            visualizationMetadata = visualizationMetadata + this.generateGridData(this.TITLE_HEIGHT, this.MAX_WIDTH, currentX, currentY, panelIndex, panelCounter);
            currentY = currentY + this.TITLE_HEIGHT;
            panelIndex = panelIndex + 1;
            panelCounter = panelCounter + 1;

            let partialRows = metrics.length / 4;
            let extraMetrics = metrics.length % 4;
            let dynamicWidth = this.MAX_WIDTH / extraMetrics;

            //Metrics
            for (let i: number = 1; i <= metrics.length; i++) {
                if (i <= (Math.floor(partialRows) * 4)) {
                    if (i % 4 > 0) {    //not the last one
                        visualizationMetadata = visualizationMetadata + this.generateGridData(this.BADGE_HEIGHT, this.QUARTER_WIDTH, currentX, currentY, panelIndex, panelCounter);
                        currentX = currentX + this.QUARTER_WIDTH;
                        panelIndex = panelIndex + 1;
                        panelCounter = panelCounter + 1;

                        if (i == metrics.length) {
                            currentY = currentY + this.BADGE_HEIGHT;
                            currentX = 0;
                        }
                    } else {    //the last one
                        visualizationMetadata = visualizationMetadata + this.generateGridData(this.BADGE_HEIGHT, this.QUARTER_WIDTH, currentX, currentY, panelIndex, panelCounter);
                        currentX = 0;
                        panelIndex = panelIndex + 1;
                        panelCounter = panelCounter + 1;
                        currentY = currentY + this.BADGE_HEIGHT;
                    }
                } else {
                    visualizationMetadata = visualizationMetadata + this.generateGridData(this.BADGE_HEIGHT, dynamicWidth, currentX, currentY, panelIndex, panelCounter);
                    currentX = currentX + dynamicWidth;
                    panelIndex = panelIndex + 1;
                    panelCounter = panelCounter + 1;

                    if (i == metrics.length) {
                        currentY = currentY + this.BADGE_HEIGHT;
                        currentX = 0;
                    }
                }

            }

            //BarCharts
            for (let i: number = 0; i < barCharts.length; i++) {
                if (i % 2 == 0) {
                    if (i == barCharts.length - 1) {    //if it is the only one
                        visualizationMetadata = visualizationMetadata + this.generateGridData(this.BAR_CHART_HEIGHT, this.MAX_WIDTH, currentX, currentY, panelIndex, panelCounter);
                        currentX = 0;
                        currentY = currentY + this.BAR_CHART_HEIGHT;
                    } else {    //if there is a second bar chart
                        visualizationMetadata = visualizationMetadata + this.generateGridData(this.BAR_CHART_HEIGHT, this.HALF_WIDTH, currentX, currentY, panelIndex, panelCounter);
                        currentX = currentX + this.HALF_WIDTH;    
                    }

                    panelIndex = panelIndex + 1;
                    panelCounter = panelCounter + 1;
                } else {
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