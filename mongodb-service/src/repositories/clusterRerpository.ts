import Cluster, { ICluster, IClusterModel } from "../models/clusterModel";
import { Repository } from "./repository";

/**
 * Extends the base Repository class and adds methods unique to Clusters.
 */
export class ClusterRepository extends Repository<ICluster> {
    constructor() {
        super(Cluster);
    }

    /**
     * Get a collection of Cluster given an Aggregation id.
     * @param id 
     */
    public getClustersByAggId(id: string): Promise<Array<IClusterModel>> {
        return Cluster.find({aggId: id}).exec();
    }

    /**
     * Save a collection of Clusters.
     * @param clusters 
     */
    public async createMultipleClusters(clusters: Array<IClusterModel>): Promise<Array<IClusterModel>> {
        for (const cluster of clusters) {
            this.create(cluster);
        }
    
        return clusters;
    }
}