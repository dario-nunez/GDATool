import * as mongoose from "mongoose";
import { Model } from "mongoose";

type FilterType = IFilter & mongoose.Document;

export interface IFilterModel {
    _id?: string;
    aggId?: string;
    aggName: string;
    query: string;
}

export interface IFilter extends IFilterModel, mongoose.Document {
    _id: string;
}

export const FilterSchema = new mongoose.Schema({
    aggId: {
        required: true,
        type: String
    },
    aggName: {
        required: true,
        type: String
    },
    query: {
        required: true,
        type: String
    }
});

const Filter: Model<IFilter> = mongoose.model<FilterType>("Filter", FilterSchema);
export default Filter;