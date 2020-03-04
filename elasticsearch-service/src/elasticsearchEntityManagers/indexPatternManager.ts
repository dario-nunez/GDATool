import { Inject } from "typescript-ioc";
import { IndexPatternBuilder } from "../elasticsearchEntityJsonBuilders/indexPatternBuilder";
import { IESIndexPattern } from "../elasticsearchModels/indexPatternModel";
import { KibanaService } from "../services/kibana-service";

/**
 * A Manager class to control the building of Index Pattern JSON objects and their starage
 * in the Elasticsearch cluster.
 */
export class IndexPatternManager {
    private indexPatternBuilder: IndexPatternBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.indexPatternBuilder = new IndexPatternBuilder();
    }

    /**
     * Creates and saves an Index Pattern to Elasticsearch
     * @param aggregationId 
     * @param operations 
     * @param featureColumns 
     */
    public createIndexPattern(aggregationId: string, operations: Array<string>, featureColumns: Array<string>) {
        const indexPatternSeed: IESIndexPattern = {
            _id: aggregationId,
            index: aggregationId,
            featureColumns: featureColumns,
            operations: operations.map((op) => op.toLowerCase())
        };

        try {
            this.kibanaService.createElasticsearchEntity(this.indexPatternBuilder.getIndexPattern(indexPatternSeed));
            return indexPatternSeed;
        } catch (error) {
            return error;
        }
    }
}