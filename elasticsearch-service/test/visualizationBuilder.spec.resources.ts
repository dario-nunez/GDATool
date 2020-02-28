export const testMarkupVis = {
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