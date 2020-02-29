import { Inject } from "typescript-ioc";
import { IndexPatternBuilder } from "../elasticsearchEntityJsonBuilders/indexPatternBuilder";
import { IIndexPattern } from "../elasticsearchModels/indexPatternModel";
import { KibanaService } from "../services/kibana-service";

export class IndexPatternManager {
    private indexPatternBuilder: IndexPatternBuilder;

    public constructor(@Inject private kibanaService: KibanaService) {
        this.indexPatternBuilder = new IndexPatternBuilder();
    }

    public createIndexPattern(aggregationId: string, aggregations: Array<string>, featureColumns: Array<string>) {
        const indexPatternSeed: IIndexPattern = {
            id: aggregationId,
            index: aggregationId,
            featureColumns: featureColumns,
            aggs: aggregations.map((e) => e.toLowerCase())
        };

        try {
            this.kibanaService.createElasticsearchEntity(this.indexPatternBuilder.getIndexPattern(indexPatternSeed));
            return indexPatternSeed;
        } catch (error) {
            return error;
        }
    }
}