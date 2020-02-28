import Cluster, { ICluster, IClusterModel } from "../models/clusterModel";
import { Repository } from "./repository";

export class ClusterRepository extends Repository<ICluster> {
    constructor() {
        super(Cluster);
    }

    public getClustersByAggId(id: string): Promise<Array<IClusterModel>> {
        return Cluster.find({aggId: id}).exec();
    }

    public async createMultipleClusters(clusters: Array<IClusterModel>): Promise<Array<IClusterModel>> {
        for (const cluster of clusters) {
            this.create(cluster);
        }
        
        return clusters;
    }
}