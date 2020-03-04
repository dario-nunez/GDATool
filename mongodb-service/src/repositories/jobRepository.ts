import * as mongoose from "mongoose";
import Aggregation, { IAggregationModel } from "../models/aggregationModel";
import Job, { IJob, IJobModel } from "../models/jobModel";
import Plot, { IPlotModel } from "../models/plotModel";
import { AggregationRepository } from "./aggregationRepository";
import { Repository } from "./repository";

/**
 * Extends the base Repository class and adds methods unique to Jobs.
 */
export class JobRepository extends Repository<IJob> {
    constructor() {
        super(Job);
    }

    /**
     * Delete a Job recursively given an id. For Jobs this involves also
     * deleting recursively the following entities: Aggregations, Plots.
     * @param id 
     */
    public async deleteRecursive(id: any): Promise<IJobModel> {
        mongoose.set("useFindAndModify", false);
        const aggregations: Array<IAggregationModel> = await Aggregation.find({ jobId: id }).exec();
        const plots = await Plot.find({ jobId: id }).exec();

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

    /**
     * Return a colelction of Jobs matching a User id.
     * @param id 
     */
    public getjobsByUserId(id: any): Promise<Array<IJobModel>> {
        return Job.find({ userId: id }).exec();
    }
}