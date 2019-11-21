export interface IAggregation {
    _id?: string;
    aggs: Array<string>;
    featureColumns: Array<string>;
    jobId: string;
    metricColumn: string;
    name: string;
    sortColumnName: string;
}