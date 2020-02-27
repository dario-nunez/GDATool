import * as mongoose from "mongoose";
import { Model } from "mongoose";

type UserType = IUser & mongoose.Document;

export interface IUserModel {
    _id: string;
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
    roles: {
        required: false,
        type: Array
    },
    dashboards: {
        required: false,
        type: Array
    },
    name: {
        required: false,
        type: String
    }
});

const User: Model<UserType> = mongoose.model<UserType>("User", UserSchema);
export default User;
