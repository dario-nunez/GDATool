import * as mongoose from "mongoose";
import { Model } from "mongoose";

type UserType = IUser & mongoose.Document;

export interface IUserModel {
    _id: string;
    username: string;
    password: string;
    email: string;
    roles: Array<string>;
    dashboards: Array<string>;
    name: string;
}

export interface IUser extends IUserModel, mongoose.Document {
    _id: string;
}

export const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    email: {
        required: true,
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

const User: Model<IUser> = mongoose.model<UserType>("User", UserSchema);
export default User;
