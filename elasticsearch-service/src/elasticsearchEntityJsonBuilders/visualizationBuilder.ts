import { IESBarChartVis } from "../elasticsearchModels/barChartVisModel";
import { IESClusterVis } from "../elasticsearchModels/clusterVisModel";
import { IESDataTableVis } from "../elasticsearchModels/dataTableVisModel";
import { IESMarkupVis } from "../elasticsearchModels/markupVisModel";
import { IESMetricVis } from "../elasticsearchModels/metricVisModel";
import { IESPlotVis } from "../elasticsearchModels/plotVisModel";

/**
 * A Builder class to handle the generation of the JSON objects that make up visualizations.
 * The format of the JSON objects is established by the .kibana index on Elasticsearch.
 */
export class VisualizationBuilder {
    protected elasticSearchUrl: string;
    protected indexName: string;

    constructor() {
        this.elasticSearchUrl = "http://localhost:9200/";
        this.indexName = ".kibana/";
    }

    /**
     * Generate the Markup visualization JSON and return it inside of a request ready to be sent to 
     * Elasticseach by an http server.
     * @param markupModel 
     */
    public getMarkup(markupModel: IESMarkupVis) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + markupModel._id,
            data:
            {
                visualization:
                {
                    title: markupModel.explorerTitle,
                    visState: '{"aggs":[],"params":{"fontSize":13,"markdown":"# ' + markupModel.displayText + ' #","openLinksInNewTab":false},"title":"whats this?","type":"markdown"}',
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

    /**
     * Generate the Bar Chart visualization JSON and return it inside of a request ready to be sent to 
     * Elasticseach by an http server.
     * @param barChartModel 
     */
    public getBarChart(barChartModel: IESBarChartVis) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + barChartModel._id,
            data:
            {
                visualization:
                {
                    title: barChartModel.explorerTitle,
                    visState: '{"title":"' + barChartModel._id + '","type":"histogram","params":{"type":"histogram","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"' + barChartModel.metricColumn + ' ' + barChartModel.operationName + '"}}],"seriesParams":[{"show":"true","type":"histogram","mode":"stacked","data":{"label":"' + barChartModel.metricColumn + ' ' + barChartModel.operationName + '","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":false,"legendPosition":"right","times":[],"addTimeMarker":false,"labels":{"show":false},"dimensions":{"x":{"accessor":0,"format":{"id":"terms","params":{"id":"string","otherBucketLabel":"Other","missingBucketLabel":"Missing"}},"params":{},"aggType":"terms"},"y":[{"accessor":1,"format":{"id":"number"},"params":{},"aggType":"max"}]}},"aggs":[{"id":"1","enabled":true,"type":"max","schema":"metric","params":{"field":"' + barChartModel.operationName + '","customLabel":"' + barChartModel.metricColumn + ' ' + barChartModel.operationName + '"}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"' + barChartModel.featureColumn + '.keyword","orderBy":"1","order":"desc","size":40,"otherBucket":true,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
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

    /**
     * Generate the Metric visualization JSON and return it inside of a request ready to be sent to 
     * Elasticseach by an http server.
     * @param metricModel 
     */
    public getMetric(metricModel: IESMetricVis) {
        // logger.info(metricModel);
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + metricModel._id,
            data:
            {
                visualization: {
                    title: metricModel.explorerTitle,
                    visState: '{"title":"' + metricModel._id + '","type":"metric","params":{"metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"type":"range","from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":25}},"dimensions":{"metrics":[{"type":"vis_dimension","accessor":0,"format":{"id":"number","params":{}}}]},"addTooltip":true,"addLegend":false,"type":"metric"},"aggs":[{"id":"1","enabled":true,"type":"' + metricModel.aggregationName + '","schema":"metric","params":{"field":"' + metricModel.aggregationName + '"}}]}',
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

    /**
     * Generate the Data Table visualization JSON and return it inside of a request ready to be sent to 
     * Elasticseach by an http server.
     * @param dataTableModel 
     */
    public getDataTable(dataTableModel: IESDataTableVis) {
        const metricArray = this.getDataTableMetrics(0);
        const bucketArray = this.getDataTableBuckets(dataTableModel.featureColumns, 1);
        const aggArray = this.getDataTableAggs(dataTableModel);

        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + dataTableModel._id,
            data: {
                visualization: {
                    title: dataTableModel.explorerTitle,
                    visState: '{\"title\":\"' + dataTableModel.explorerTitle + '\",\"type\":\"' + dataTableModel.type + '\",\"params\":{\"perPage\":8,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":true,\"totalFunc\":\"sum\",\"dimensions\":{\"metrics\":[' + metricArray + '],\"buckets\":[' + bucketArray + ']}},\"aggs\":[' + aggArray + ']}',
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
        };
    }

    /**
     * Generate the Vega Plot visualization JSON and return it inside of a request ready to be sent to 
     * Elasticseach by an http server.
     * @param plotModel 
     */
    public getVegaPlot(plotModel: IESPlotVis) {
        let sourceArray = "";
        if (plotModel.identifier === plotModel.xAxis || plotModel.identifier === plotModel.yAxis) {
            sourceArray = '\\n \\\"'+ plotModel.xAxis +'\\\",\\n \\\"'+ plotModel.yAxis +'\\\"\\n ';
        } else {
            sourceArray = '\\n \\\"'+ plotModel.xAxis +'\\\",\\n \\\"'+ plotModel.yAxis +'\\\",\\n \\\"'+ plotModel.identifier +'\\\"\\n ';
        }
        
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + plotModel._id,
            data: {
                visualization: {
                    title: plotModel.explorerTitle,
                    visState: '{\"title\":\"'+ plotModel.explorerTitle +'\",\"type\":\"vega\",\"params\":{\"spec\":\"{\\n $schema: https: //vega.github.io/schema/vega-lite/v2.json\\n mark: {\\n type: point\\n filled: true\\n }\\n \\n data: {\\n url: {\\n index: \\\"'+ plotModel.index +'\\\"\\n \\n body: {\\n size: 10000\\n _source: ['+ sourceArray +']\\n }\\n }\\n \\n format: {property: \\\"hits.hits\\\"\\n }\\n }\\n \\n encoding: {\\n x: {\\n field: _source.'+ plotModel.xAxis +'\\n type: '+ plotModel.xType +'\\n axis: {title: \\\"'+ plotModel.xAxis +'\\\"\\n }\\n }\\n \\n y: {\\n field: _source.'+ plotModel.yAxis +'\\n type: '+ plotModel.yType +'\\n axis: {title: \\\"'+ plotModel.yAxis +'\\\"\\n }\\n }\\n \\n tooltip: {\\n field: _source.'+ plotModel.identifier +'\\n type: '+ plotModel.identifierType +'\\n }\\n }\\n}\"},\"aggs\":[]}',
                    uiStateJSON: "{}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: {
                        "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
                    }
                },
                type: "visualization",
                references: [] as Array<any>,
                migrationVersion: {
                    "visualization": "7.3.0"
                },
                updated_at: "2020-02-19T23:01:38.803Z"
            }
        };
    }

    /**
     * Generate the Vega Cluster visualization JSON and return it inside of a request ready to be sent to 
     * Elasticseach by an http server.
     * @param clusterModel 
     */
    public getVegaCluster(clusterModel: IESClusterVis) {
        let sourceArray = "";
        if (clusterModel.identifier === clusterModel.xAxis || clusterModel.identifier === clusterModel.yAxis) {
            sourceArray = '\\n \\\"'+ clusterModel.xAxis +'\\\",\\n \\\"'+ clusterModel.yAxis +'\\\",\\n \\\"cluster\\\"\\n ';
        } else {
            sourceArray = '\\n \\\"'+ clusterModel.xAxis +'\\\",\\n \\\"'+ clusterModel.yAxis +'\\\",\\n \\\"cluster\\\"\\n \\\"'+ clusterModel.identifier +'\\\"\\n ';
        }
        
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + clusterModel._id,
            data: {
                visualization: {
                    title: clusterModel.explorerTitle,
                    visState: '{\"title\":\"'+ clusterModel.explorerTitle +'\",\"type\":\"vega\",\"params\":{\"spec\":\"{\\n $schema: https: //vega.github.io/schema/vega-lite/v2.json\\n mark: {\\n type: point\\n }\\n \\n data: {\\n url: {\\n index: \\\"'+ clusterModel.index +'\\\"\\n \\n body: {\\n size: 10000\\n _source: ['+ sourceArray +']\\n }\\n }\\n \\n format: {property: \\\"hits.hits\\\"\\n }\\n }\\n \\n encoding: {\\n x: {\\n field: _source.'+ clusterModel.xAxis +'\\n type: '+ clusterModel.xType +'\\n axis: {title: \\\"'+ clusterModel.xAxis +'\\\"\\n }\\n }\\n \\n y: {\\n field: _source.'+ clusterModel.yAxis +'\\n type: '+ clusterModel.yType +'\\n axis: {title: \\\"'+ clusterModel.yAxis +'\\\"\\n }\\n }\\n \\n tooltip: {\\n field: _source.'+ clusterModel.identifier +'\\n type: '+ clusterModel.identifierType +'\\n } \\n \\\"color\\\": {\\n \\\"field\\\": \\\"_source.cluster\\\",\\n \\\"title\\\": \\\"clusters\\\",\\n \\\"type\\\": \\\"nominal\\\"\\n }\\n \\\"shape\\\": {\\n \\\"field\\\": \\\"_source.cluster\\\",\\n \\\"type\\\": \\\"nominal\\\"\\n}\\n }\\n}\"},\"aggs\":[]}',
                    uiStateJSON: "{}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: {
                        "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
                    }
                },
                type: "visualization",
                references: [] as Array<any>,
                migrationVersion: {
                    "visualization": "7.3.0"
                },
                updated_at: "2020-02-19T23:01:38.803Z"
            }
        };
    }

    /**
     * Generate a section responsible for declaring metric columns in the Data Table.
     * @param currentIndex 
     */
    private getDataTableMetrics(currentIndex: number) {
        return '{\"accessor\":' + currentIndex + ',\"format\":{\"id\":\"number\"},\"params\":{},\"aggType\":\"max\"}';
    }

    /**
     * Generate a section responsible for declaring feature columns in the Data Table.
     * @param featureColumns 
     * @param currentIndex 
     */
    private getDataTableBuckets(featureColumns: Array<string>, currentIndex: number) {
        let bucketsArray = "";

        featureColumns.forEach(column => {
            bucketsArray = bucketsArray + ',{\"accessor\":' + currentIndex + ',\"format\":{\"id\":\"terms\",\"params\":{\"id\":\"string\",\"otherBucketLabel\":\"Other\",\"missingBucketLabel\":\"Missing\"}},\"params\":{},\"aggType\":\"terms\"}';

            currentIndex = currentIndex + 1;
        });

        return bucketsArray.substring(1, bucketsArray.length);
    }

    /**
     * Generate a section responsible for declaring aggregation columns in the Data Table
     * @param dataTableModel 
     */
    private getDataTableAggs(dataTableModel: IESDataTableVis) {
        let currentId = 1;
        let aggsArray = "";

        dataTableModel.featureColumns.forEach(featureColumn => {
            aggsArray = aggsArray + ',{\"id\":\"' + currentId + '\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"' + featureColumn + '.keyword\",\"orderBy\":\"_key\",\"order\":\"desc\",\"size\":10000,\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}';

            currentId = currentId + 1;
        });

        dataTableModel.operations.forEach(operationColumn => {
            aggsArray = aggsArray + ',{\"id\":\"' + currentId + '\",\"enabled\":true,\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"' + operationColumn.toLocaleLowerCase() + '\",\"customLabel\":\"' + operationColumn.toLocaleLowerCase() + '\"}}';

            currentId = currentId + 1;
        });

        return aggsArray.substring(1, aggsArray.length);
    }
}