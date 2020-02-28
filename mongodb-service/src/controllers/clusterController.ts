import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST } from "typescript-rest";
import { ICluster, IClusterModel } from "../models/clusterModel";
import { ClusterRepository } from "../repositories/clusterRerpository";
import { Controller } from "./controller";

@Path("/ms/cluster")
export class ClusterController extends Controller<ICluster> {
    constructor(@Inject private clusterRepository: ClusterRepository) {
        super(clusterRepository);
    }

    @Path("getAll")
    @GET
    public async getAllClusters(): Promise<Array<IClusterModel>> {
        return await this.clusterRepository.getAll();
    }

    @Path("byAgg/:id")
    @GET
    public async getClustersByAggId(@PathParam("id") id: string): Promise<Array<IClusterModel>> {
        return await this.clusterRepository.getClustersByAggId(id);
    }

    @Path("/multiple")
    @POST
    public async createMultipleClusters(clusters: Array<IClusterModel>): Promise<Array<IClusterModel>> {
        return await this.clusterRepository.createMultipleClusters(clusters);
    }

    @POST
    public async createCluster(cluster: IClusterModel): Promise<IClusterModel> {
        return await this.clusterRepository.create(cluster);
    }

    @Path(":id")
    @DELETE
    public async deleteAggregation(@PathParam("id") id: string): Promise<IClusterModel> {
        return await this.clusterRepository.delete(id);
    }
}