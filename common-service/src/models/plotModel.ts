import * as mongoose from "mongoose";
import { Model } from "mongoose";

type PlotType = IPlot & mongoose.Document;

export interface IPlotModel {
    _id: string;
    jobId: string;
    identifier: string;
    xAxis: string;
    yAxis: string;
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
    xAxis: {
        required: true,
        type: String
    },
    yAxis: {
        required: true,
        type: String
    }
});

const Plot: Model<IPlot> = mongoose.model<PlotType>("Plot", PlotSchema);
export default Plot;