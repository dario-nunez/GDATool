import { Repository } from "../../../common-service/src/repositories/repository";
import Job from "../../../common-service/src/models/jobModel";
import Aggregation, { IAggregation } from "../models/aggregationModel";

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
}
