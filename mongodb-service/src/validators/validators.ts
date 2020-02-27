import * as express from "express";
import {Errors} from "typescript-rest";
import { IUser } from "../models/userModel";
import {UserRepository} from "../repositories/userRepository";

export async function uniqueEmailValidator(req: express.Request): Promise<express.Request> {
    const user: IUser = req.body;
    const userRepository: UserRepository = new UserRepository();
    const existingUsers: Array<IUser> = await userRepository.getByFields({
        email: user.email.trim()
    });
    
    if (existingUsers.length < 1) {
        // Allow if no user exists with that email
        return req;
    } else if (existingUsers.length === 1 && existingUsers[0]._id.toString() === user._id.toString()) {
        // Allow if only one user with it exists and its id is the same as the user requesting a change
        return req;
    } else {
        throw new Errors.BadRequestError("Email already exists");
    }
}
