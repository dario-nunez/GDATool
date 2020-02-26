import Aggregation, { IAggregation, IAggregationModel } from "../../../common-service/src/models/aggregationModel";
import Job from "../../../common-service/src/models/jobModel";
import { Repository } from "../../../common-service/src/repositories/repository";

export class AggregationRepository extends Repository<IAggregation> {
    
    constructor() {
        super(Aggregation);
    }

    public async getAggsByUser(id: any): Promise<any> {
        const jobIds = new Array();
        const jobs = await Job.find({ userId: id }).exec();

        jobs.forEach((job: any) => {
            jobIds.push(job.id);
        });

        return Aggregation.find({ jobId: { $in: jobIds } }).exec();
    }

    public getAggsByJob(id: any): Promise<any> {
        return Aggregation.find({ jobId: id }).exec();
    }

    public async createMultipleAggregations(aggregations: Array<IAggregationModel>): Promise<Array<IAggregationModel>> {
        const returnAggregations = [];

        for (const agg of aggregations) {
            const newAgg = await this.create(agg);
            returnAggregations.push(newAgg);
        }

        return returnAggregations;
    }
}
