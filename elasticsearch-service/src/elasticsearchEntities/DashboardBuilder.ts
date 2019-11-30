import { IDashboard } from "../elasticsearchModels/dashboardModel";

export class DashboardBuilder {
    protected elasticSearchUrl: string;
    protected indexName: string;
    
    private FONT_SIZE: number = 30;
    private TITLE_HEIGHT: number = 5;
    private BADGE_HEIGHT: number = 5;
    private BAR_CHART_HEIGHT: number = 16;

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

        for (const vis of dashboardModel.visualizations) {
            referenceArray.push({
                name: "panel_" + panelCounter,
                type: "visualization",
                id: vis.id + "_" + vis.type
            });

            panelCounter = panelCounter + 1;
        }
        return referenceArray;
    }

    private getVisualizationMetadata(dashboardModel: IDashboard): string {
        const markdownVisHeight: number = 5;
        const barVisHeight: number = 16;
        let panelIndex: number = 0;
        let currentY: number = 0;
        let panelCounter = 0;
        let visualizationMetadata = "[";

        //title

        //badges

        //barCharts

        for (const vis of dashboardModel.visualizations) {
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