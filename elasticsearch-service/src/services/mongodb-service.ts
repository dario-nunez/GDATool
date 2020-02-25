import axios from "axios";

export class MongodbService {
    public getAggsByJob(jobId: string): Promise<any> {
        return axios.get("http://localhost:5000/ms/aggregation/byJob/" + jobId);
    }

    public getJobById(jobId: string): Promise<any> {
        return axios.get("http://localhost:5000/ms/job/" + jobId);
    }

    public getPlotsByJob(jobId: string): Promise<any> {
        return axios.get("http://localhost:5000/ms/plot/byJob/" + jobId);
    }

    public getClustersByAgg(aggId: string): Promise<any> {
        return axios.get("http://localhost:5000/ms/cluster/byAgg/" + aggId);
    }
}
