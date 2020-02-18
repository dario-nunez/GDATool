import { IVisMarkup } from "../elasticsearchModels/visMarkupModel";
import { IVisBarCHart } from "../elasticsearchModels/visBarChartModel";
import { IDataTable } from "../elasticsearchModels/dataTableModel";
import { IMetric } from "../elasticsearchModels/metricModel";

export class VisualizationBuilder {
    protected elasticSearchUrl: string;
    protected indexName: string;

    constructor() {
        this.elasticSearchUrl = "http://localhost:9200/";
        this.indexName = ".kibana/";
    }

    public getMarkup(markupModel: IVisMarkup) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + markupModel.id,
            data:
            {
                visualization:
                {
                    title: markupModel.explorerTitle,
                    visState: '{"aggs":[],"params":{"fontSize":13,"markdown":"# ' + markupModel.displayTitle + ' #","openLinksInNewTab":false},"title":"whats this?","type":"markdown"}',
                    uiStateJSON: "{}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: { searchSourceJSON: '{"query":{"language":"kuery","query":""},"filter":[]}' }
                },
                type: "visualization",
                references: [] as Array<any>,
                migrationVersion: {
                    visualization: "7.3.0"
                },
                updated_at: "2019-06-23T22:22:58.233Z"
            }
        };
    }

    public getBarChart(barChartModel: IVisBarCHart) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + barChartModel.id,
            data:
            {
                visualization:
                {
                    title: barChartModel.explorerTitle,
                    visState: '{"title":"' + barChartModel.id + '","type":"histogram","params":{"type":"histogram","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"' + barChartModel.metricColumn + ' ' + barChartModel.aggregationName + '"}}],"seriesParams":[{"show":"true","type":"histogram","mode":"stacked","data":{"label":"' + barChartModel.metricColumn + ' ' + barChartModel.aggregationName + '","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":false,"legendPosition":"right","times":[],"addTimeMarker":false,"labels":{"show":false},"dimensions":{"x":{"accessor":0,"format":{"id":"terms","params":{"id":"string","otherBucketLabel":"Other","missingBucketLabel":"Missing"}},"params":{},"aggType":"terms"},"y":[{"accessor":1,"format":{"id":"number"},"params":{},"aggType":"max"}]}},"aggs":[{"id":"1","enabled":true,"type":"max","schema":"metric","params":{"field":"' + barChartModel.aggregationName + '","customLabel":"' + barChartModel.metricColumn + ' ' + barChartModel.aggregationName + '"}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"' + barChartModel.featureColumn + '.keyword","orderBy":"1","order":"desc","size":40,"otherBucket":true,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
                    uiStateJSON: "{}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: {
                        searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[],"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.index"}'
                    }
                },
                type: "visualization",
                references: [
                    {
                        name: "kibanaSavedObjectMeta.searchSourceJSON.index",
                        type: "index-pattern",
                        id: barChartModel.index
                    }
                ],
                migrationVersion: {
                    visualization: "7.3.0"
                },
                updated_at: "2019-06-23T21:51:18.131Z"
            }
        };
    }

    public getMetric(metricModel: IMetric) {
        // logger.info(metricModel);
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + metricModel.id,
            data:
            {
                visualization: {
                    title: metricModel.explorerTitle,
                    visState: '{"title":"' + metricModel.id + '","type":"metric","params":{"metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"type":"range","from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":25}},"dimensions":{"metrics":[{"type":"vis_dimension","accessor":0,"format":{"id":"number","params":{}}}]},"addTooltip":true,"addLegend":false,"type":"metric"},"aggs":[{"id":"1","enabled":true,"type":"' + metricModel.aggregationName + '","schema":"metric","params":{"field":"' + metricModel.aggregationName + '"}}]}',
                    uiStateJSON: "{}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: {
                        searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[],"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.index"}'
                    }
                },
                type: "visualization",
                references: [
                    {
                        name: "kibanaSavedObjectMeta.searchSourceJSON.index",
                        type: "index-pattern",
                        id: metricModel.index
                    }
                ],
                migrationVersion: {
                    visualization: "7.3.0"
                },
                updated_at: "2019-11-30T16:26:00.099Z"
            }
        };
    }

    public getDataTable(dataTableModel: IDataTable) {
        let metricArray = this.getDataTableMetrics(0);
        let bucketArray = this.getDataTableBuckets(dataTableModel.featureColumns, 1);
        let aggArray = this.getDataTableAggs(dataTableModel);

        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + dataTableModel.id,
            data: {
                visualization: {
                    title: dataTableModel.explorerTitle,
                    visState: '{\"title\":\"'+ dataTableModel.explorerTitle +'\",\"type\":\"'+ dataTableModel.type +'\",\"params\":{\"perPage\":8,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":true,\"totalFunc\":\"sum\",\"dimensions\":{\"metrics\":['+ metricArray +'],\"buckets\":['+ bucketArray +']}},\"aggs\":['+ aggArray +']}',
                    uiStateJSON: "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: {
                        "searchSourceJSON": "{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[],\"indexRefName\":\"kibanaSavedObjectMeta.searchSourceJSON.index\"}"
                    }
                },
                type: "visualization",
                references: [
                    {
                        name: "kibanaSavedObjectMeta.searchSourceJSON.index",
                        type: "index-pattern",
                        id: dataTableModel.index
                    }
                ],
                migrationVersion: {
                    visualization: "7.3.0"
                },
                updated_at: "2020-02-16T23:15:15.943Z"
            }
        }
    }

    private getDataTableMetrics(currentIndex: number) {
        return '{\"accessor\":'+ currentIndex +',\"format\":{\"id\":\"number\"},\"params\":{},\"aggType\":\"max\"}'
    }

    private getDataTableBuckets(featureColumns: string[], currentIndex: number) {
        let bucketsArray = ""

        featureColumns.forEach(column => {
            bucketsArray = bucketsArray + ',{\"accessor\":'+ currentIndex +',\"format\":{\"id\":\"terms\",\"params\":{\"id\":\"string\",\"otherBucketLabel\":\"Other\",\"missingBucketLabel\":\"Missing\"}},\"params\":{},\"aggType\":\"terms\"}';

            currentIndex = currentIndex + 1;
        });

        return bucketsArray.substring(1, bucketsArray.length);
    }

    private getDataTableAggs(dataTableModel: IDataTable) {
        let currentId = 1;
        let aggsArray = "";

        dataTableModel.featureColumns.forEach(featureColumn => {
            aggsArray = aggsArray + ',{\"id\":\"'+ currentId +'\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"'+ featureColumn +'.keyword\",\"orderBy\":\"_key\",\"order\":\"desc\",\"size\":20,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}'

            currentId = currentId + 1;
        });

        dataTableModel.operations.forEach(operationColumn => {
            aggsArray = aggsArray + ',{\"id\":\"' + currentId + '\",\"enabled\":true,\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"'+ operationColumn.toLocaleLowerCase() +'\",\"customLabel\":\"'+ operationColumn.toLocaleLowerCase() +'\"}}'

            currentId = currentId + 1;
        });

        return aggsArray.substring(1, aggsArray.length);
    }
}