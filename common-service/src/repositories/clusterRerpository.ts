import Cluster, { ICluster } from "../models/clusterModel";
import { Repository } from "./repository";

export class ClusterRepository extends Repository<ICluster> {
    constructor() {
        super(Cluster);
    }

    public getClustersByAggId(id: any): Promise<any> {
        return Cluster.find({aggId: id}).exec();
    }

    public async createMultipleClusters(clusters: Array<any>): Promise<Array<ICluster>> {
        for (const cluster of clusters) {
            this.create(cluster);
        }

        return clusters;
    }
}