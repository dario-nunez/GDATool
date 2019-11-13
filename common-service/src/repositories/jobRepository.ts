import Job, { IJob } from "../models/jobModel";
import { Repository } from "./repository";

export class JobRepository extends Repository<IJob> {
    constructor() {
        super(Job);
    }
}
