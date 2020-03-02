import { Inject } from "typescript-ioc";
import { IndexPatternBuilder } from "../elasticsearchEntityJsonBuilders/indexPatternBuilder";
import { IESIndexPattern } from "../elasticsearchModels/indexPatternModel";
import { KibanaService } from "../services/kibana-service";

export class IndexPatternManager {
    private indexPatternBuilder: IndexPatternBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.indexPatternBuilder = new IndexPatternBuilder();
    }

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