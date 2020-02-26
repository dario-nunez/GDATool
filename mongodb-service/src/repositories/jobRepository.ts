import { IJob } from "../../../common-service/src/models/jobModel";
import Job from "../../../common-service/src/models/jobModel";
import { Repository } from "../../../common-service/src/repositories/repository";

export class JobRepository extends Repository<IJob> {
    constructor() {
        super(Job);
    }

    public getjobsByUserId(id: any): Promise<Array<IJob>> {
        return Job.find({ userId: id }).exec();
    }
}
