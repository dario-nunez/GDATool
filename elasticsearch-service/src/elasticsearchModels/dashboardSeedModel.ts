import { IAggregation } from "../../../common-service/src/models/aggregationModel";
import { IJob } from "../../../common-service/src/models/jobModel";

export interface IDashboardSeed {
    job: IJob;
    aggregations: Array<IAggregation>;
}
