import * as mongoose from "mongoose";
import { Model } from "mongoose";

type ClusterType = ICluster & mongoose.Document;

export interface IClusterModel {
    _id?: string;
    aggId?: string;
    aggName: string;
    identifier: string;
    identifierType: string;
    xAxis: string;
    xType: string;
    yAxis: string;
    yType: string;
}

export interface ICluster extends IClusterModel, mongoose.Document {
    _id: string;
}

export const ClusterSchema = new mongoose.Schema({
    aggId: {
        required: true,
        type: String
    },
    aggName: {
        required: true,
        type: String
    },
    identifier: {
        required: true,
        type: String
    },
    identifierType: {
        required: true,
        type: String
    },
    xAxis: {
        required: true,
        type: String
    },
    xType: {
        required: true,
        type: String
    },
    yAxis: {
        required: true,
        type: String
    },
    yType: {
        required: true,
        type: String
    }
});

const Cluster: Model<ICluster> = mongoose.model<ClusterType>("Cluster", ClusterSchema);
export default Cluster;