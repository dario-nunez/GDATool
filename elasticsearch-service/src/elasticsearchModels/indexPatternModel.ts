export interface IIndexPattern {
    id: string;
    index: string;
    featureColumns: Array<string>;
    aggs: Array<string>;
}
