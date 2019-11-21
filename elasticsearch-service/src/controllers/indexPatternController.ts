import logger from "../../../common-service/src/logger/loggerFactory";
import { Inject } from "typescript-ioc";
import { Path, PUT } from "typescript-rest";
import { IIndexPattern } from "../elasticsearchModels/indexPatternModel";
import { KibanaService } from "../services/kibana-service";
import { ElasticServiceBaseController } from "./elasticServerBaseController";

@Path("/es/indexPattern")
export class IndexPatternController extends ElasticServiceBaseController {

    constructor(@Inject private kibanaService: KibanaService) {
        super();
    }

    /**
     * Creates a new index pattern.
     * @param newIndexPattern The index pattern object to be created and stored in the database.
     */
    @PUT
    public async createIndexPattern(newIndexPattern: IIndexPattern): Promise<any> {
        logger.info("Create index pattern: ");
        logger.info(newIndexPattern);
        const indexPatternJSON = this.getIndexPatternJSON(newIndexPattern);

        let featureColumnsJSONLines = "";

        for (const columnName of newIndexPattern.featureColumns) {
            featureColumnsJSONLines = featureColumnsJSONLines + ',{\"name\":\"' + columnName + '\",\"type\":\"string\",\"esTypes\":[\"text\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false}';
            featureColumnsJSONLines = featureColumnsJSONLines + ',{\"name\":\"' + columnName + '.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"parent\":\"Id\",\"subType\":\"multi\"}';
        }


        try {
            const response = await this.kibanaService.createIndexPattern(indexPatternJSON);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    public getIndexPatternJSON(indexPattern: IIndexPattern) {
        const defaultJSONLines = "{\"name\":\"_id\",\"type\":\"string\",\"esTypes\":[\"_id\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}," +
            "{\"name\":\"_index\",\"type\":\"string\",\"esTypes\":[\"_index\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}," +
            "{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false}," +
            "{\"name\":\"_source\",\"type\":\"_source\",\"esTypes\":[\"_source\"],\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false}," +
            "{\"name\":\"_type\",\"type\":\"string\",\"esTypes\":[\"_type\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}";

        const featureColumnsJSONLines = this.getFeatureColumnJSONLines(indexPattern);
        const aggsJSONLines = this.getAggregationJSONLines(indexPattern);

        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/index-pattern:" + indexPattern.id,
            data:
            {
                "index-pattern":
                {
                    title: indexPattern.index,
                    fields: "[" + defaultJSONLines + featureColumnsJSONLines + aggsJSONLines + "]"
                },
                "migrationVersion": { "index-pattern": "6.5.0" },
                "type": "index-pattern",
                "updated_at": "2019-06-23T21:46:31.462Z"
            }
        };
    }

    private getAggregationJSONLines(indexPattern: IIndexPattern) {
        let aggsJSONLines = "";

        for (const agg of indexPattern.aggs) {
            aggsJSONLines = aggsJSONLines + ',{\"name\":\"' + agg + '\",\"type\":\"number\",\"esTypes\":[\"long\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}';
        }

        return aggsJSONLines;
    }

    private getFeatureColumnJSONLines(indexPattern: IIndexPattern) {
        let featureColumnsJSONLines = "";

        for (const columnName of indexPattern.featureColumns) {
            featureColumnsJSONLines = featureColumnsJSONLines + ',{\"name\":\"' + columnName + '\",\"type\":\"string\",\"esTypes\":[\"text\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false}';
            featureColumnsJSONLines = featureColumnsJSONLines + ',{\"name\":\"' + columnName + '.keyword\",\"type\":\"string\",\"esTypes\":[\"keyword\"],\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true,\"parent\":\"Id\",\"subType\":\"multi\"}';
        }

        return featureColumnsJSONLines;
    }
}
