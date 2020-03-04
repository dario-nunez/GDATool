import * as mongoose from "mongoose";
import { Model } from "mongoose";

/**
 * Filter type, model mongoose document and schema definition. Models are used by
 * Controllers so they are picked up by the swagger. Documents and schemas are used by 
 * Repositories so model defined Mongodb functions can be used.
 */
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