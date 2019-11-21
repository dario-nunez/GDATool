import User, { IUser } from "../models/userModel";
import { Repository } from "./repository";
import { IJob } from "../models/jobModel";
import Job from "../models/jobModel";
import * as mongoose from "mongoose";
import Aggregation from "../models/aggregationModel";
import { IAggregation } from "../models/aggregationModel";
import logger from "../logger/loggerFactory";

export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }

    public async authenticateUser(email: string, password: string): Promise<any> {
        const user: IUser = await User.findOne({ email: email }).lean().exec();

        if (user != null && user.password === password) {
            return {
                id: user._id,
                email: user.email
            };
        }

        return {
            id: null,
            email: null
        };
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return User.findOne({ email: email }).lean().exec();
    }

    public async deleteRecursive(id: any): Promise<IUser> {
        const jobIds = await Job.find({ userId: id }).exec();
        let aggIds: any[] = [];

        for (let job of jobIds){
            const jobAggs = await Aggregation.find({ jobId: job._id }).exec();
            jobAggs.forEach(element => {
                aggIds.push(element);
            });
        }

        mongoose.set("useFindAndModify", false);

        await aggIds.forEach((agg: IAggregation) => {    
            Aggregation.findByIdAndRemove(agg._id).exec();
        });

        await jobIds.forEach((job: IJob) => {    
            Job.findByIdAndRemove(job._id).exec();
        });

        return User.findByIdAndRemove(id).exec();
    }
}
