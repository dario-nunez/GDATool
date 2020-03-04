import axios from "axios";
import { IAggregationModel } from "../../../mongodb-service/src/models/aggregationModel";
import { IClusterModel } from "../../../mongodb-service/src/models/clusterModel";
import { IJobModel } from "../../../mongodb-service/src/models/jobModel";
import { IPlotModel } from "../../../mongodb-service/src/models/plotModel";

/**
 * An http service that interacts with the mongodb-service. It is used to indirectly access Mongodb.
 * Only the necessary methods to the elasticsearch-service are found in this class.
 */
export class MongodbService {
    public async getAggsByJob(jobId: string): Promise<Array<IAggregationModel>> {
        const response = await axios.get("http://localhost:5000/ms/aggregation/byJob/" + jobId);
        return response.data;
    }

    public async getJobById(jobId: string): Promise<IJobModel> {
        const response = await axios.get("http://localhost:5000/ms/job/" + jobId);
        return response.data;
    }

    public async getPlotsByJob(jobId: string): Promise<Array<IPlotModel>> {
        const response = await axios.get("http://localhost:5000/ms/plot/byJob/" + jobId);
        return response.data;
    }

    public async getClustersByAgg(aggId: string): Promise<Array<IClusterModel>> {
        const response = await axios.get("http://localhost:5000/ms/cluster/byAgg/" + aggId);
        return response.data;
    }
}
