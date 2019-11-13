import * as mongoose from "mongoose";
import { Model } from "mongoose";

type JobType = IJob & mongoose.Document;

export interface IJobModel {
    description: string;
    rawInputDirectory: string;
    stagingFileName: string;
    userId: string;
    generateESIndices: boolean;
}

export interface IJob extends IJobModel,  mongoose.Document {    
}

export const JobSchema = new mongoose.Schema({
    description: {
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
    userId: {
        default: "dummy",
        required: true,
        type: String
    }
}, {timestamps: true});

const Job: Model<JobType> = mongoose.model<JobType>("Job", JobSchema);
export default Job;
