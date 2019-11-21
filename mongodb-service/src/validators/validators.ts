import { IUser } from "../../../common-service/src/models/userModel";
import {UserRepository} from "../../../common-service/src/repositories/userRepository";
import * as express from "express";
import {Errors} from "typescript-rest";

export async function uniqueEmailValidator(req: express.Request): Promise<express.Request> {
    const user: IUser = req.body;
    const userRepository: UserRepository = new UserRepository();
    const existingUsers: Array<IUser> = await userRepository.getByFields({
        email: user.email.trim()
    });
    if (existingUsers.length > 0) {
        throw new Errors.BadRequestError("Email already exists");
    }
    return req;
}
