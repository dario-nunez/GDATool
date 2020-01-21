import * as mongoose from "mongoose";
import { Model } from "mongoose";

type JobType = IJob & mongoose.Document;

export interface IJobModel {
    _id: string;
    name: string;
    description: string;
    rawInputDirectory: string;
    stagingFileName: string;
    userId: string;
    generateESIndices: boolean;
    runs: Array<string>;
    jobStatus: number;
}

export interface IJob extends IJobModel, mongoose.Document {
    _id: string;
}

export const JobSchema = new mongoose.Schema({
    description: {
        default: "dummy",
        required: true,
        type: String
    },
    name: {
        default: "dummy",
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
    runs: {
        required: false,
        type: Array
    },
    jobStatus: {
        default: 0,
        required: true,
        type: Number
    },
    userId: {
        default: "dummy",
        required: true,
        type: String
    }
}, { timestamps: true });

const Job: Model<JobType> = mongoose.model<JobType>("Job", JobSchema);
export default Job;
