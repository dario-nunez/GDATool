import * as mongoose from "mongoose";
import { Model } from "mongoose";

/**
 * User type, model mongoose document and schema definition. Models are used by
 * Controllers so they are picked up by the swagger. Documents and schemas are used by 
 * Repositories so model defined Mongodb functions can be used.
 */
type UserType = IUser & mongoose.Document;
export interface IUserModel {
    _id?: string;
    password: string;
    email: string;
    name: string;
}

export interface IUser extends IUserModel, mongoose.Document {
    _id: string;
}

export const UserSchema = new mongoose.Schema({
    password: {
        required: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    name: {
        required: false,
        type: String
    }
});

const User: Model<IUser> = mongoose.model<UserType>("User", UserSchema);
export default User;
