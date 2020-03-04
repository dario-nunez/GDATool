import * as mongoose from "mongoose";
import { Model } from "mongoose";

/**
 * Plot type, model mongoose document and schema definition. Models are used by
 * Controllers so they are picked up by the swagger. Documents and schemas are used by 
 * Repositories so model defined Mongodb functions can be used.
 */
type PlotType = IPlot & mongoose.Document;
export interface IPlotModel {
    _id?: string;
    jobId: string;
    identifier: string;
    identifierType: string;
    xAxis: string;
    xType: string;
    yAxis: string;
    yType: string;
}

export interface IPlot extends IPlotModel, mongoose.Document {
    _id: string;
}

export const PlotSchema = new mongoose.Schema({
    jobId: {
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
    },
});

const Plot: Model<IPlot> = mongoose.model<PlotType>("Plot", PlotSchema);
export default Plot;