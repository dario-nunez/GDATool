import * as mongoose from "mongoose";
import Aggregation, { IAggregation } from "../../../common-service/src/models/aggregationModel";
import Job, { IJob } from "../models/jobModel";
import { Repository } from "./repository";

export class JobRepository extends Repository<IJob> {
    constructor() {
        super(Job);
    }

    public async deleteRecursive(id: any): Promise<IJob>{
        const aggregationIds = await Aggregation.find({jobId: id}).exec();
        
        mongoose.set("useFindAndModify", false);
        await aggregationIds.forEach((agg: IAggregation) => {    
            Aggregation.findByIdAndRemove(agg._id).exec();
        });

        return Job.findByIdAndRemove(id).exec();
    }

    public getjobsByUserId(id: any): Promise<Array<IJob>> {
        return Job.find({ userId: id }).exec();
    }
}
