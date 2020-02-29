export const expectedDashboard = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/dashboard:test_id_dashboard',
    data: {
        dashboard: {
            title: 'test_title_dashboard',
            hits: 0,
            description: '',
            panelsJSON: ']',
            optionsJSON: '{"useMargins":true,"hidePanelTitles":false}',
            version: 1,
            timeRestore: false,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[]}'
            }
        },
        type: 'dashboard',
        references: [
            { name: 'panel_0', type: 'visualization', id: 'test_id1' },
            { name: 'panel_1', type: 'visualization', id: 'test_id2' },
            { name: 'panel_2', type: 'visualization', id: 'test_id1' },
            { name: 'panel_3', type: 'visualization', id: 'test_id2' }
        ],
        migrationVersion: { dashboard: '7.3.0' },
        updated_at: '2019-07-04T16:35:09.831Z'
    }
};