import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST } from "typescript-rest";
import { ICluster, IClusterModel } from "../models/clusterModel";
import { ClusterRepository } from "../repositories/clusterRerpository";
import { Controller } from "./controller";

/**
 * Cluster endpoints rooted at "/ms/cluster".
 */
@Path("/ms/cluster")
export class ClusterController extends Controller<ICluster> {
    constructor(@Inject private clusterRepository: ClusterRepository) {
        super(clusterRepository);
    }

    /**
     * Return all clusters.
     */
    @Path("getAll")
    @GET
    public async getAllClusters(): Promise<Array<IClusterModel>> {
        return await this.clusterRepository.getAll();
    }

    /**
     * Returns a collection of Clusters given an Aggregation id.
     * @param id 
     */
    @Path("byAgg/:id")
    @GET
    public async getClustersByAggId(@PathParam("id") id: string): Promise<Array<IClusterModel>> {
        return await this.clusterRepository.getClustersByAggId(id);
    }

    /**
     * Store a collection of Clusters.
     * @param clusters 
     */
    @Path("/multiple")
    @POST
    public async createMultipleClusters(clusters: Array<IClusterModel>): Promise<Array<IClusterModel>> {
        return await this.clusterRepository.createMultipleClusters(clusters);
    }

    /**
     * Store a single given Cluster.
     * @param cluster
     */
    @POST
    public async createCluster(cluster: IClusterModel): Promise<IClusterModel> {
        return await this.clusterRepository.create(cluster);
    }

    /**
     * Delete a Cluster by id.
     * @param id
     */
    @Path(":id")
    @DELETE
    public async deleteCluster(@PathParam("id") id: string): Promise<IClusterModel> {
        return await this.clusterRepository.delete(id);
    }
}