import { Controller } from "../../../common-service/src/controllers/controller";
import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST, PUT } from "typescript-rest";
import { IAggregation, IAggregationModel } from "../../../common-service/src/models/aggregationModel";
import { AggregationRepository } from "../repositories/aggregationRepository";

@Path("/ms/aggregation")
export class AggregationController extends Controller<IAggregation> {

    constructor(@Inject private aggregationRepository: AggregationRepository) {
        super(aggregationRepository);
    }

    @Path("getAll")
    @GET
    public async getAllAggregations(): Promise<Array<IAggregationModel>> {
        return await this.aggregationRepository.getAll();
    }

    @Path(":id")
    @GET
    public async getAggregationById(@PathParam("id") id: string): Promise<IAggregationModel> {
        return await this.aggregationRepository.getById(id);
    }

    @POST
    public async createAggregation(aggregation: IAggregationModel): Promise<IAggregationModel> {
        return await this.aggregationRepository.create(aggregation);
    }

    @Path("/multiple")
    @POST
    public async createMultipleAggregation(aggregations: IAggregationModel[]): Promise<IAggregationModel[]> {
        return await this.aggregationRepository.createMultipleAggregations(aggregations);
    }

    @Path(":id")
    @PUT
    public async updateAggregation(@PathParam("id") id: string, aggregation: IAggregationModel): Promise<IAggregationModel> {
        return await this.aggregationRepository.update(id, aggregation);
    }

    @Path(":id")
    @DELETE
    public async deleteAggregation(@PathParam("id") id: string): Promise<IAggregationModel> {
        return await this.aggregationRepository.delete(id);
    }

    @Path("byUser/:id")
    @GET
    public async getAggregationsByUser(@PathParam("id") id: string): Promise<IAggregationModel> {
        return await this.aggregationRepository.getAggsByUser(id);
    }

    @Path("byJob/:id")
    @GET
    public async getAggregationsByJob(@PathParam("id") id: string): Promise<IAggregationModel> {
        return await this.aggregationRepository.getAggsByJob(id);
    }
}
