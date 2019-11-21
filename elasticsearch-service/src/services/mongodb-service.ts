import axios from "axios";

export class MongodbService {
    public getAggsByJob(jobId: string): Promise<any> {
        return axios.get("http://localhost:5000/ms/aggregation/byJob/" + jobId);
    }

    public getJobById(jobId: string): Promise<any> {
        return axios.get("http://localhost:5000/ms/job/" + jobId);
    }
}
