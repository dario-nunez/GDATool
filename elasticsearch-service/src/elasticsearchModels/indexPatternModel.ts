export interface IESIndexPattern {
    _id: string;
    index: string;
    featureColumns: Array<string>;
    aggs: Array<string>;
}
