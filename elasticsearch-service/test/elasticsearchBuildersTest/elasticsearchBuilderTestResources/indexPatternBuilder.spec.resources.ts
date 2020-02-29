export const expectedIndexPatternEntity = {
    method: 'PUT',
    url: 'http://localhost:9200/.kibana/_doc/index-pattern:test_id',
    data: {
        'index-pattern': {
            title: 'test_index',
            fields: '[{"name":"_id","type":"string","esTypes":["_id"],"count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","esTypes":["_index"],"count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","esTypes":["_source"],"count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","esTypes":["_type"],"count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"test_featureColumn1","type":"string","esTypes":["text"],"count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"test_featureColumn1.keyword","type":"string","esTypes":["keyword"],"count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true,"parent":"Id","subType":"multi"},{"name":"test_featureColumn2","type":"string","esTypes":["text"],"count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"test_featureColumn2.keyword","type":"string","esTypes":["keyword"],"count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true,"parent":"Id","subType":"multi"},{"name":"test_agg1","type":"number","esTypes":["long"],"count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"test_agg2","type":"number","esTypes":["long"],"count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true}]'
        },
        migrationVersion: { 'index-pattern': '6.5.0' },
        type: 'index-pattern',
        updated_at: '2019-06-23T21:46:31.462Z'
    }
};