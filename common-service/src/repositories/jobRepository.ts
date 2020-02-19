import * as mongoose from "mongoose";
import Aggregation, { IAggregation } from "../models/aggregationModel";
import Job, { IJob } from "../models/jobModel";
import Plot, { IPlot } from "../models/plotModel";
import { Repository } from "./repository";

export class JobRepository extends Repository<IJob> {
    constructor() {
        super(Job);
    }

    public async deleteRecursive(id: any): Promise<IJob>{
        const aggregationIds = await Aggregation.find({jobId: id}).exec();
        const plotIds = await Plot.find({jobId: id}).exec();

        mongoose.set("useFindAndModify", false);
        await aggregationIds.forEach((agg: IAggregation) => {    
            Aggregation.findByIdAndRemove(agg._id).exec();
        });

        await plotIds.forEach((plot: IPlot) => {
            Plot.findByIdAndRemove(plot._id).exec();
        });

        return Job.findByIdAndRemove(id).exec();
    }

    public getjobsByUserId(id: any): Promise<Array<IJob>> {
        return Job.find({ userId: id }).exec();
    }
}
