export const expectedMarkupVisualization = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/visualization:test_id',
    data: {
        visualization: {
            title: 'test_explorerTitle',
            visState: '{"aggs":[],"params":{"fontSize":13,"markdown":"# test_displayTitle #","openLinksInNewTab":false},"title":"whats this?","type":"markdown"}',
            uiStateJSON: '{}',
            description: '',
            version: 1,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"language":"kuery","query":""},"filter":[]}'
            }
        },
        type: 'visualization',
        references: [] as Array<any>,
        migrationVersion: { visualization: '7.3.0' },
        updated_at: '2019-06-23T22:22:58.233Z'
    }
};

export const expectedBarChartVisualization = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/visualization:test_id',
    data: {
        visualization: {
            title: 'test_explorerTitle',
            visState: '{"title":"test_id","type":"histogram","params":{"type":"histogram","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"test_metricColumn test_aggregationName"}}],"seriesParams":[{"show":"true","type":"histogram","mode":"stacked","data":{"label":"test_metricColumn test_aggregationName","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":false,"legendPosition":"right","times":[],"addTimeMarker":false,"labels":{"show":false},"dimensions":{"x":{"accessor":0,"format":{"id":"terms","params":{"id":"string","otherBucketLabel":"Other","missingBucketLabel":"Missing"}},"params":{},"aggType":"terms"},"y":[{"accessor":1,"format":{"id":"number"},"params":{},"aggType":"max"}]}},"aggs":[{"id":"1","enabled":true,"type":"max","schema":"metric","params":{"field":"test_aggregationName","customLabel":"test_metricColumn test_aggregationName"}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"test_featureColumn.keyword","orderBy":"1","order":"desc","size":40,"otherBucket":true,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
            uiStateJSON: '{}',
            description: '',
            version: 1,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[],"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.index"}'
            }
        },
        type: 'visualization',
        references: [
            {
                name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                type: 'index-pattern',
                id: 'test_index'
            }
        ],
        migrationVersion: { visualization: '7.3.0' },
        updated_at: '2019-06-23T21:51:18.131Z'
    }
};

export const expectedMetricVisualization = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/visualization:test_id',
    data: {
        visualization: {
            title: 'test_explorerTitle',
            visState: '{"title":"test_id","type":"metric","params":{"metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"type":"range","from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":25}},"dimensions":{"metrics":[{"type":"vis_dimension","accessor":0,"format":{"id":"number","params":{}}}]},"addTooltip":true,"addLegend":false,"type":"metric"},"aggs":[{"id":"1","enabled":true,"type":"test_aggregationName","schema":"metric","params":{"field":"test_aggregationName"}}]}',
            uiStateJSON: '{}',
            description: '',
            version: 1,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[],"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.index"}'
            }
        },
        type: 'visualization',
        references: [
            {
                name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                type: 'index-pattern',
                id: 'test_index'
            }
        ],
        migrationVersion: { visualization: '7.3.0' },
        updated_at: '2019-11-30T16:26:00.099Z'
    }
};

export const expectedDataTableVisualization = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/visualization:test_id',
    data: {
        visualization: {
            title: 'test_explorerTitle',
            visState: '{"title":"test_explorerTitle","type":"test_type","params":{"perPage":8,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":true,"totalFunc":"sum","dimensions":{"metrics":[{"accessor":0,"format":{"id":"number"},"params":{},"aggType":"max"}],"buckets":[{"accessor":1,"format":{"id":"terms","params":{"id":"string","otherBucketLabel":"Other","missingBucketLabel":"Missing"}},"params":{},"aggType":"terms"},{"accessor":2,"format":{"id":"terms","params":{"id":"string","otherBucketLabel":"Other","missingBucketLabel":"Missing"}},"params":{},"aggType":"terms"}]}},"aggs":[{"id":"1","enabled":true,"type":"terms","schema":"bucket","params":{"field":"test_featureColumn1.keyword","orderBy":"_key","order":"desc","size":10000,"otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"test_featureColumn2.keyword","orderBy":"_key","order":"desc","size":10000,"otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"3","enabled":true,"type":"max","schema":"metric","params":{"field":"test_operation1","customLabel":"test_operation1"}},{"id":"4","enabled":true,"type":"max","schema":"metric","params":{"field":"test_operation2","customLabel":"test_operation2"}}]}',
            uiStateJSON: '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
            description: '',
            version: 1,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"language":"kuery","query":""},"filter":[],"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.index"}'
            }
        },
        type: 'visualization',
        references: [
            {
                name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                type: 'index-pattern',
                id: 'test_index'
            }
        ],
        migrationVersion: { visualization: '7.3.0' },
        updated_at: '2020-02-16T23:15:15.943Z'
    }
};

export const expectedPlotVisualization = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/visualization:test_id',
    data: {
        visualization: {
            title: 'test_explorerTitle',
            visState: '{"title":"test_explorerTitle","type":"vega","params":{"spec":"{\\n $schema: https: //vega.github.io/schema/vega-lite/v2.json\\n mark: {\\n type: point\\n filled: true\\n }\\n \\n data: {\\n url: {\\n index: \\"test_index\\"\\n \\n body: {\\n size: 10000\\n _source: [\\n \\"test_xAxis\\",\\n \\"test_yAxis\\",\\n \\"test_identifier\\"\\n ]\\n }\\n }\\n \\n format: {property: \\"hits.hits\\"\\n }\\n }\\n \\n encoding: {\\n x: {\\n field: _source.test_xAxis\\n type: test_xType\\n axis: {title: \\"test_xAxis\\"\\n }\\n }\\n \\n y: {\\n field: _source.test_yAxis\\n type: test_yType\\n axis: {title: \\"test_yAxis\\"\\n }\\n }\\n \\n tooltip: {\\n field: _source.test_identifier\\n type: test_identifierType\\n }\\n }\\n}"},"aggs":[]}',
            uiStateJSON: '{}',
            description: '',
            version: 1,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[]}'
            }
        },
        type: 'visualization',
        references: [] as Array<any>,
        migrationVersion: { visualization: '7.3.0' },
        updated_at: '2020-02-19T23:01:38.803Z'
    }
};

export const expectedClusterVisualization = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/visualization:test_id',
    data: {
        visualization: {
            title: 'test_explorerTitle',
            visState: '{"title":"test_explorerTitle","type":"vega","params":{"spec":"{\\n $schema: https: //vega.github.io/schema/vega-lite/v2.json\\n mark: {\\n type: point\\n }\\n \\n data: {\\n url: {\\n index: \\"test_index\\"\\n \\n body: {\\n size: 10000\\n _source: [\\n \\"test_xAxis\\",\\n \\"test_yAxis\\",\\n \\"cluster\\"\\n \\"test_identifier\\"\\n ]\\n }\\n }\\n \\n format: {property: \\"hits.hits\\"\\n }\\n }\\n \\n encoding: {\\n x: {\\n field: _source.test_xAxis\\n type: test_xType\\n axis: {title: \\"test_xAxis\\"\\n }\\n }\\n \\n y: {\\n field: _source.test_yAxis\\n type: test_yType\\n axis: {title: \\"test_yAxis\\"\\n }\\n }\\n \\n tooltip: {\\n field: _source.test_identifier\\n type: test_identifierType\\n } \\n \\"color\\": {\\n \\"field\\": \\"_source.cluster\\",\\n \\"title\\": \\"clusters\\",\\n \\"type\\": \\"nominal\\"\\n }\\n \\"shape\\": {\\n \\"field\\": \\"_source.cluster\\",\\n \\"type\\": \\"nominal\\"\\n}\\n }\\n}"},"aggs":[]}',
            uiStateJSON: '{}',
            description: '',
            version: 1,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[]}'
            }
        },
        type: 'visualization',
        references: [] as Array<any>,
        migrationVersion: { visualization: '7.3.0' },
        updated_at: '2020-02-19T23:01:38.803Z'
    }
};