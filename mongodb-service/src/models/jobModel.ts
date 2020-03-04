import * as mongoose from "mongoose";
import { Model } from "mongoose";

/**
 * Job type, model mongoose document and schema definition. Models are used by
 * Controllers so they are picked up by the swagger. Documents and schemas are used by 
 * Repositories so model defined Mongodb functions can be used.
 */
type JobType = IJob & mongoose.Document;
export interface IJobModel {
    _id?: string;
    name: string;
    description: string;
    rawInputDirectory: string;
    stagingFileName: string;
    userId: string;
    generateESIndices: boolean;
    jobStatus: number;
}

export interface IJob extends IJobModel, mongoose.Document {
    _id: string;
}

export const JobSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    generateESIndices: {
        default: true,
        required: true,
        type: Boolean
    },
    rawInputDirectory: {
        required: false,
        type: String
    },
    stagingFileName: {
        required: false,
        type: String
    },
    jobStatus: {
        default: 0,
        required: true,
        type: Number
    },
    userId: {
        required: true,
        type: String
    }
}, { timestamps: true });

const Job: Model<IJob> = mongoose.model<JobType>("Job", JobSchema);
export default Job;
