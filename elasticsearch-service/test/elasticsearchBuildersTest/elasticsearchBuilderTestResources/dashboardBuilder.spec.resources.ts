/**
 * Dashboard Builder Test resources
 */
export const expectedDashboard1 = {
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

export const dashboardSeed = {
    _id: '5e58d68f0c2f923ec696b639',
    title: '5e58d68f0c2f923ec696b639',
    visualizations: [
        [
            { _id: '5e58d68f0c2f923ec696b639_markdown', type: 'markdown' },
            { _id: '5e58d8850c2f923ec696b63c_plot', type: 'plot' },
            { _id: '5e58d8850c2f923ec696b63d_plot', type: 'plot' }
        ],
        [
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_markdown',
                type: 'markdown'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63acount_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63asum_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63amax_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63amin_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63aavg_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_count_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_sum_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_max_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_min_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_avg_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_table',
                type: 'table'
            },
            {
                _id: '5e58d8850c2f923ec696b63a_5e58d8850c2f923ec696b63e_cluster',
                type: 'cluster'
            }
        ],
        [
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_markdown',
                type: 'markdown'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bcount_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bsum_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bmax_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bmin_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bavg_metric',
                type: 'metric'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_count_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_sum_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_max_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_min_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_avg_bar',
                type: 'bar'
            },
            {
                _id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_table',
                type: 'table'
            },
            {
                _id: '5e58d8850c2f923ec696b63b_5e58d8850c2f923ec696b63f_cluster',
                type: 'cluster'
            }
        ]
    ],
    description: 'This is a dashboard description'
};

export const expectedDashboard2 = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/dashboard:5e58d68f0c2f923ec696b639_dashboard',
    data: {
        dashboard: {
            title: '5e58d68f0c2f923ec696b639_dashboard',
            hits: 0,
            description: '',
            panelsJSON: '[{"gridData":{"w":48,"h":5,"x":0,"y":0,"i":"0"},"version":"7.3.0","panelIndex":"0","embeddableConfig":{},"panelRefName":"panel_0"},{"gridData":{"w":24,"h":16,"x":0,"y":5,"i":"1"},"version":"7.3.0","panelIndex":"1","embeddableConfig":{},"panelRefName":"panel_1"},{"gridData":{"w":24,"h":16,"x":24,"y":5,"i":"2"},"version":"7.3.0","panelIndex":"2","embeddableConfig":{},"panelRefName":"panel_2"},{"gridData":{"w":48,"h":5,"x":0,"y":21,"i":"3"},"version":"7.3.0","panelIndex":"3","embeddableConfig":{},"panelRefName":"panel_3"},{"gridData":{"w":12,"h":6,"x":0,"y":26,"i":"4"},"version":"7.3.0","panelIndex":"4","embeddableConfig":{},"panelRefName":"panel_4"},{"gridData":{"w":12,"h":6,"x":12,"y":26,"i":"5"},"version":"7.3.0","panelIndex":"5","embeddableConfig":{},"panelRefName":"panel_5"},{"gridData":{"w":12,"h":6,"x":24,"y":26,"i":"6"},"version":"7.3.0","panelIndex":"6","embeddableConfig":{},"panelRefName":"panel_6"},{"gridData":{"w":12,"h":6,"x":36,"y":26,"i":"7"},"version":"7.3.0","panelIndex":"7","embeddableConfig":{},"panelRefName":"panel_7"},{"gridData":{"w":48,"h":6,"x":0,"y":32,"i":"8"},"version":"7.3.0","panelIndex":"8","embeddableConfig":{},"panelRefName":"panel_8"},{"gridData":{"w":24,"h":16,"x":0,"y":38,"i":"9"},"version":"7.3.0","panelIndex":"9","embeddableConfig":{},"panelRefName":"panel_9"},{"gridData":{"w":24,"h":16,"x":24,"y":38,"i":"10"},"version":"7.3.0","panelIndex":"10","embeddableConfig":{},"panelRefName":"panel_10"},{"gridData":{"w":24,"h":16,"x":0,"y":54,"i":"11"},"version":"7.3.0","panelIndex":"11","embeddableConfig":{},"panelRefName":"panel_11"},{"gridData":{"w":24,"h":16,"x":24,"y":54,"i":"12"},"version":"7.3.0","panelIndex":"12","embeddableConfig":{},"panelRefName":"panel_12"},{"gridData":{"w":48,"h":16,"x":0,"y":70,"i":"13"},"version":"7.3.0","panelIndex":"13","embeddableConfig":{},"panelRefName":"panel_13"},{"gridData":{"w":48,"h":17,"x":0,"y":86,"i":"14"},"version":"7.3.0","panelIndex":"14","embeddableConfig":{},"panelRefName":"panel_14"},{"gridData":{"w":48,"h":16,"x":0,"y":103,"i":"15"},"version":"7.3.0","panelIndex":"15","embeddableConfig":{},"panelRefName":"panel_15"},{"gridData":{"w":48,"h":5,"x":0,"y":119,"i":"16"},"version":"7.3.0","panelIndex":"16","embeddableConfig":{},"panelRefName":"panel_16"},{"gridData":{"w":12,"h":6,"x":0,"y":124,"i":"17"},"version":"7.3.0","panelIndex":"17","embeddableConfig":{},"panelRefName":"panel_17"},{"gridData":{"w":12,"h":6,"x":12,"y":124,"i":"18"},"version":"7.3.0","panelIndex":"18","embeddableConfig":{},"panelRefName":"panel_18"},{"gridData":{"w":12,"h":6,"x":24,"y":124,"i":"19"},"version":"7.3.0","panelIndex":"19","embeddableConfig":{},"panelRefName":"panel_19"},{"gridData":{"w":12,"h":6,"x":36,"y":124,"i":"20"},"version":"7.3.0","panelIndex":"20","embeddableConfig":{},"panelRefName":"panel_20"},{"gridData":{"w":48,"h":6,"x":0,"y":130,"i":"21"},"version":"7.3.0","panelIndex":"21","embeddableConfig":{},"panelRefName":"panel_21"},{"gridData":{"w":24,"h":16,"x":0,"y":136,"i":"22"},"version":"7.3.0","panelIndex":"22","embeddableConfig":{},"panelRefName":"panel_22"},{"gridData":{"w":24,"h":16,"x":24,"y":136,"i":"23"},"version":"7.3.0","panelIndex":"23","embeddableConfig":{},"panelRefName":"panel_23"},{"gridData":{"w":24,"h":16,"x":0,"y":152,"i":"24"},"version":"7.3.0","panelIndex":"24","embeddableConfig":{},"panelRefName":"panel_24"},{"gridData":{"w":24,"h":16,"x":24,"y":152,"i":"25"},"version":"7.3.0","panelIndex":"25","embeddableConfig":{},"panelRefName":"panel_25"},{"gridData":{"w":48,"h":16,"x":0,"y":168,"i":"26"},"version":"7.3.0","panelIndex":"26","embeddableConfig":{},"panelRefName":"panel_26"},{"gridData":{"w":48,"h":17,"x":0,"y":184,"i":"27"},"version":"7.3.0","panelIndex":"27","embeddableConfig":{},"panelRefName":"panel_27"},{"gridData":{"w":48,"h":16,"x":0,"y":201,"i":"28"},"version":"7.3.0","panelIndex":"28","embeddableConfig":{},"panelRefName":"panel_28"}]',
            optionsJSON: '{"useMargins":true,"hidePanelTitles":false}',
            version: 1,
            timeRestore: false,
            kibanaSavedObjectMeta: {
                searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[]}'
            }
        },
        type: 'dashboard',
        references: [
            {
                name: 'panel_0',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_markdown'
            },
            {
                name: 'panel_1',
                type: 'visualization',
                id: '5e58d8850c2f923ec696b63c_plot'
            },
            {
                name: 'panel_2',
                type: 'visualization',
                id: '5e58d8850c2f923ec696b63d_plot'
            },
            {
                name: 'panel_3',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_markdown'
            },
            {
                name: 'panel_4',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63acount_metric'
            },
            {
                name: 'panel_5',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63asum_metric'
            },
            {
                name: 'panel_6',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63amax_metric'
            },
            {
                name: 'panel_7',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63amin_metric'
            },
            {
                name: 'panel_8',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63aavg_metric'
            },
            {
                name: 'panel_9',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_count_bar'
            },
            {
                name: 'panel_10',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_sum_bar'
            },
            {
                name: 'panel_11',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_max_bar'
            },
            {
                name: 'panel_12',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_min_bar'
            },
            {
                name: 'panel_13',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_avg_bar'
            },
            {
                name: 'panel_14',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63a_table'
            },
            {
                name: 'panel_15',
                type: 'visualization',
                id: '5e58d8850c2f923ec696b63a_5e58d8850c2f923ec696b63e_cluster'
            },
            {
                name: 'panel_16',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_markdown'
            },
            {
                name: 'panel_17',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bcount_metric'
            },
            {
                name: 'panel_18',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bsum_metric'
            },
            {
                name: 'panel_19',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bmax_metric'
            },
            {
                name: 'panel_20',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bmin_metric'
            },
            {
                name: 'panel_21',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63bavg_metric'
            },
            {
                name: 'panel_22',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_count_bar'
            },
            {
                name: 'panel_23',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_sum_bar'
            },
            {
                name: 'panel_24',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_max_bar'
            },
            {
                name: 'panel_25',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_min_bar'
            },
            {
                name: 'panel_26',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_avg_bar'
            },
            {
                name: 'panel_27',
                type: 'visualization',
                id: '5e58d68f0c2f923ec696b639_5e58d8850c2f923ec696b63b_table'
            },
            {
                name: 'panel_28',
                type: 'visualization',
                id: '5e58d8850c2f923ec696b63b_5e58d8850c2f923ec696b63f_cluster'
            }
        ],
        migrationVersion: { dashboard: '7.3.0' },
        updated_at: '2019-07-04T16:35:09.831Z'
    }
};