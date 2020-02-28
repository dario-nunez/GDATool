import * as mongoose from "mongoose";
import Job from "../models/jobModel";
import User, { IUser, IUserModel } from "../models/userModel";
import { JobRepository } from "./jobRepository";
import { Repository } from "./repository";

export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }

    public async authenticateUser(email: string, password: string): Promise<IUserModel> {
        const user: IUser = await User.findOne({ email: email }).lean().exec();

        if (user != null && user.password === password) {
            return user;
        }

        return null;
    }

    public async getUserByEmail(email: string): Promise<IUserModel> {
        return User.findOne({ email: email }).lean().exec();
    }

    public async deleteRecursive(id: string): Promise<IUserModel> {
        mongoose.set("useFindAndModify", false);
        const jobs = await Job.find({ userId: id }).exec();

        const jobRepository: JobRepository = new JobRepository();

        for (const job of jobs){
            await jobRepository.deleteRecursive(job._id);
        }

        return await User.findByIdAndRemove(id).exec();
    }
}
