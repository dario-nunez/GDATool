import { IESIndexPattern } from "../elasticsearchModels/indexPatternModel";

/**
 * A Builder class to handle the generation of the JSON object that makes up an Index Pattern.
 * The format of the JSON object is established by the .kibana index on Elasticsearch.
 */
export class IndexPatternBuilder {
    protected elasticSearchUrl: string;
    protected indexName: string;

    constructor() {
        this.elasticSearchUrl = "http://localhost:9200/";
        this.indexName = ".kibana/";
    }

    /**
     * Generate the Index Pattern JSON and return it inside of a request ready to be sent to 
     * Elasticseach by an http server.
     * @param indexPatternModel 
     */
    public getIndexPattern(indexPatternModel: IESIndexPattern) {
        const defaultJSONLines = "{\"name\":\"_id\",\"type\":\"string\",\"esTypes\":[\"_id\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}," +
            "{\"name\":\"_index\",\"type\":\"string\",\"esTypes\":[\"_index\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}," +
            "{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false}," +
            "{\"name\":\"_source\",\"type\":\"_source\",\"esTypes\":[\"_source\"],\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false}," +
            "{\"name\":\"_type\",\"type\":\"string\",\"esTypes\":[\"_type\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}";

        const featureColumnsJSONLines = this.getFeatureColumnJSONLines(indexPatternModel);
        const aggsJSONLines = this.getOperationJSONLines(indexPatternModel);

        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/index-pattern:" + indexPatternModel._id,
            data:
            {
                "index-pattern":
                {
                    title: indexPatternModel.index,
                    fields: "[" + defaultJSONLines + featureColumnsJSONLines + aggsJSONLines + "]"
                },
                "migrationVersion": { "index-pattern": "6.5.0" },
                "type": "index-pattern",
                "updated_at": "2019-06-23T21:46:31.462Z"
            }
        };
    }

    /**
     * Generate the section responsible for declaring which operation (numeric) rows in the index are 
     * accessible to visualizations.
     * @param indexPatternModel 
     */
    private getOperationJSONLines(indexPatternModel: IESIndexPattern) {
        let operationJSONLines = "";

        for (const operation of indexPatternModel.operations) {
            operationJSONLines = operationJSONLines + ',{\"name\":\"' + operation + '\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}';
        }

        return operationJSONLines;
    }

    /**
     * Generate the section responsible for declaring which feature rows (strings) in the index are 
     * accessible to visualizations.
     * @param indexPatternModel 
     */
    private getFeatureColumnJSONLines(indexPatternModel: IESIndexPattern) {
        let featureColumnsJSONLines = "";

        for (const columnName of indexPatternModel.featureColumns) {
            featureColumnsJSONLines = featureColumnsJSONLines + ',{\"name\":\"' + columnName + '\",\"type\":\"string\",\"esTypes\":[\"text\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false}';
            featureColumnsJSONLines = featureColumnsJSONLines + ',{\"name\":\"' + columnName + '.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"parent\":\"Id\",\"subType\":\"multi\"}';
        }

        return featureColumnsJSONLines;
    }
}