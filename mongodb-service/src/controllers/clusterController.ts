import { Controller } from "../../../common-service/src/controllers/controller";
import { Inject } from "typescript-ioc";
import { GET, Path, POST, PathParam } from "typescript-rest";
import { ClusterRepository } from "../../../common-service/src/repositories/clusterRerpository";
import { IClusterModel, ICluster } from "../../../common-service/src/models/clusterModel";

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
    public async getClustersByAggId(@PathParam("id") id: string): Promise<IClusterModel> {
        return await this.clusterRepository.getClustersByAggId(id);
    }

    @Path("/multiple")
    @POST
    public async createMultipleClusters(clusters: IClusterModel[]): Promise<IClusterModel[]> {
        return await this.clusterRepository.createMultipleClusters(clusters);
    }

    @POST
    public async createCluster(cluster: IClusterModel): Promise<IClusterModel> {
        return await this.clusterRepository.create(cluster);
    }
}