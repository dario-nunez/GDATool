import { IAggregation } from "../../../mongodb-service/src/models/aggregationModel";
import { IJob } from "../../../mongodb-service/src/models/jobModel";

export interface IDashboardSeed {
    job: IJob;
    aggregations: Array<IAggregation>;
}
