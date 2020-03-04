import * as mongoose from "mongoose";
import { Model } from "mongoose";

/**
 * Aggregation type, model mongoose document and schema definition. Models are used by
 * Controllers so they are picked up by the swagger. Documents and schemas are used by 
 * Repositories so model defined Mongodb functions can be used.
 */
type AggregationType = IAggregation & mongoose.Document;
export interface IAggregationModel {
    _id?: string;
    operations: Array<string>;
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
    operations: {
        required: true,
        type: Array
    },
    featureColumns: {
        required: true,
        type: Array
    },
    jobId: {
        required: true,
        type: String
    },
    metricColumn: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    sortColumnName: {
        required: true,
        type: String
    }
});

const Aggregation: Model<IAggregation> = mongoose.model<AggregationType>("Aggregation", AggregationSchema);
export default Aggregation;
