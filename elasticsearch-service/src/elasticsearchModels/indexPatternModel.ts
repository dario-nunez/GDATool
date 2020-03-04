/**
 * Encapsulates the minimum metadata necessary to create an Index Pattern object.
 */
export interface IESIndexPattern {
    _id: string;
    index: string;
    featureColumns: Array<string>;
    operations: Array<string>;
}
