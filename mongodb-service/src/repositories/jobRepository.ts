import * as mongoose from "mongoose";
import Aggregation, { IAggregation } from "../models/aggregationModel";
import Cluster from "../models/clusterModel";
import { ICluster } from "../models/clusterModel";
import { IFilter } from "../models/filterModel";
import Filter from "../models/filterModel";
import Job, { IJob } from "../models/jobModel";
import Plot, { IPlot } from "../models/plotModel";
import { Repository } from "./repository";

export class JobRepository extends Repository<IJob> {
    constructor() {
        super(Job);
    }

    // Udate to delete clusters and filters
    public async deleteRecursive(id: any): Promise<IJob>{
        const aggregationIds: Array<IAggregation> = await Aggregation.find({jobId: id}).exec();
        const plotIds = await Plot.find({jobId: id}).exec();

        mongoose.set("useFindAndModify", false);
        for (const agg of aggregationIds) {
            const clusterIds: Array<ICluster> = await Cluster.find({aggId: agg._id}).exec();
            const filterIds: Array<IFilter> = await Filter.find({aggId: agg._id}).exec();

            // Delete Clusers
            await clusterIds.forEach((cluster:ICluster) => {
                Cluster.findByIdAndRemove(cluster._id).exec();
            });

            // Delete Filters
            await filterIds.forEach((filter:IFilter) => {
                Filter.findByIdAndRemove(filter._id).exec();
            });

            // Delete Aggregations
            await Aggregation.findByIdAndRemove(agg._id).exec();
        }

        // await aggregationIds.forEach((agg: IAggregation) => {   
        //     const clusterIds = await Cluster.find({aggId: agg._id}).exec();
        //     Aggregation.findByIdAndRemove(agg._id).exec();
        // });

        // Delete Plots
        await plotIds.forEach((plot: IPlot) => {
            Plot.findByIdAndRemove(plot._id).exec();
        });

        // Delete Job
        return Job.findByIdAndRemove(id).exec();
    }

    public getjobsByUserId(id: any): Promise<Array<IJob>> {
        return Job.find({ userId: id }).exec();
    }
}