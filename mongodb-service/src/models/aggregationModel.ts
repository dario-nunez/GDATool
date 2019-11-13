import * as mongoose from "mongoose";

export interface IAggregation extends mongoose.Document {
    aggs: Array<string>;
    featureColumns: Array<string>;
    jobId: string;
    metricColumn: string;
    name: string;
    sortColumnName: string;
}

export const AggregationSchema = new mongoose.Schema({
    aggs: {
        default: ["dummy"],
        required: true,
        type: Array
    },
    featureColumns: {
        default: ["dummy"],
        required: true,
        type: Array
    },
    jobId: {
        default: "dummy",
        required: true,
        type: String
    },
    metricColumn: {
        default: "dummy",
        required: true,
        type: String
    },
    name: {
        default: "dummy",
        required: true,
        type: String
    },
    sortColumnName: {
        default: "dummy",
        required: true,
        type: String
    }
});

const Aggregation = mongoose.model<IAggregation>("Aggregation", AggregationSchema);
export default Aggregation;
