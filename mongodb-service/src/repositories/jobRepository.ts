import * as mongoose from "mongoose";
import Aggregation, { IAggregationModel } from "../models/aggregationModel";
import Job, { IJob, IJobModel } from "../models/jobModel";
import Plot, { IPlotModel } from "../models/plotModel";
import { AggregationRepository } from "./aggregationRepository";
import { Repository } from "./repository";

export class JobRepository extends Repository<IJob> {
    constructor() {
        super(Job);
    }

    // Udate to delete clusters and filters
    public async deleteRecursive(id: any): Promise<IJobModel> {
        mongoose.set("useFindAndModify", false);
        const aggregations: Array<IAggregationModel> = await Aggregation.find({jobId: id}).exec();
        const plots = await Plot.find({jobId: id}).exec();

        const aggregationRepository: AggregationRepository = new AggregationRepository();

        // Delete aggregations
        for (const aggregation of aggregations) {
            await aggregationRepository.deleteRecursive(aggregation._id);
        }

        // Delete Plots
        await plots.forEach((plot: IPlotModel) => {
            Plot.findByIdAndRemove(plot._id).exec();
        });

        // Delete Job
        return await Job.findByIdAndRemove(id).exec();
    }

    public getjobsByUserId(id: any): Promise<Array<IJobModel>> {
        return Job.find({ userId: id }).exec();
    }
}