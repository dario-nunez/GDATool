import * as mongoose from "mongoose";
import Job from "../models/jobModel";
import User, { IUser, IUserModel } from "../models/userModel";
import { JobRepository } from "./jobRepository";
import { Repository } from "./repository";

/**
 * Extends the base Repository class and adds methods unique to Users.
 */
export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }

    /**
     * Authenticate a user given an email and password. Verify that there is a user in the
     * database containing the email and password provided. Return an empty IUserModel
     * object if this check fails.
     * @param email 
     * @param password 
     */
    public async authenticateUser(email: string, password: string): Promise<IUserModel> {
        const user: IUserModel = await User.findOne({ email: email }).lean().exec();

        if (user != null && user.password === password) {
            return user;
        }

        const responseUser: IUserModel = {
            _id: "",
            name: "",
            email: "",
            password: ""
        };

        return responseUser;
    }

    /**
     * Return a user matching an email.
     * @param email 
     */
    public async getUserByEmail(email: string): Promise<IUserModel> {
        return User.findOne({ email: email }).lean().exec();
    }

    /**
     * Delete a User recursively given an id. For User this involves also
     * deleting recursively the following entities: Jobs.
     * @param id 
     */
    public async deleteRecursive(id: string): Promise<IUserModel> {
        mongoose.set("useFindAndModify", false);
        const jobs = await Job.find({ userId: id }).exec();

        const jobRepository: JobRepository = new JobRepository();

        // Delete jobs recursively.
        for (const job of jobs) {
            await jobRepository.deleteRecursive(job._id);
        }

        // Delete user.
        return await User.findByIdAndRemove(id).exec();
    }
}
