import * as mongoose from "mongoose";
import { Model } from "mongoose";

type AggregationType = IAggregation & mongoose.Document;

export interface IAggregationModel {
    _id: string;
    aggs: Array<string>;
    featureColumns: Array<string>;
    jobId: string;
    metricColumn: string;
    name: string;
    sortColumnName: string;
}

export interface IAggregation extends IAggregationModel, mongoose.Document {
    _id: string;
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

const Aggregation: Model<IAggregation> = mongoose.model<AggregationType>("Aggregation", AggregationSchema);
export default Aggregation;
