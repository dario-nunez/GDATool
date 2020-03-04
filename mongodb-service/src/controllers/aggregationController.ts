import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST, PUT } from "typescript-rest";
import { IAggregation, IAggregationModel } from "../models/aggregationModel";
import { AggregationRepository } from "../repositories/aggregationRepository";
import { Controller } from "./controller";

/**
 * Aggregation endpoints rooted at "/ms/aggregation".
 */
@Path("/ms/aggregation")
export class AggregationController extends Controller<IAggregation> {

    constructor(@Inject private aggregationRepository: AggregationRepository) {
        super(aggregationRepository);
    }

    /**
     * Returns all Aggregations.
     */
    @Path("getAll")
    @GET
    public async getAllAggregations(): Promise<Array<IAggregationModel>> {
        return await this.aggregationRepository.getAll();
    }

    /**
     * Returns an Aggregation with a certain id.
     * @param id 
     */
    @Path(":id")
    @GET
    public async getAggregationById(@PathParam("id") id: string): Promise<IAggregationModel> {
        return await this.aggregationRepository.getById(id);
    }

    /**
     * Stores the given Aggregation.
     * @param aggregation 
     */
    @POST
    public async createAggregation(aggregation: IAggregationModel): Promise<IAggregationModel> {
        return await this.aggregationRepository.create(aggregation);
    }
    
    /**
     * Stores a given collection of Aggregations.
     * @param aggregations 
     */
    @Path("multiple")
    @POST
    public async createMultipleAggregations(aggregations: Array<IAggregationModel>): Promise<Array<IAggregationModel>> {
        return await this.aggregationRepository.createMultipleAggregations(aggregations);
    }

    /**
     * Update an Aggregation given the original id and the updated object.
     * @param id 
     * @param aggregation 
     */
    @Path(":id")
    @PUT
    public async updateAggregation(@PathParam("id") id: string, aggregation: IAggregationModel): Promise<IAggregationModel> {
        return await this.aggregationRepository.update(id, aggregation);
    }

    /**
     * Delete an Aggregation given an id.
     * @param id 
     */
    @Path(":id")
    @DELETE
    public async deleteAggregation(@PathParam("id") id: string): Promise<IAggregationModel> {
        return await this.aggregationRepository.delete(id);
    }

    /**
     * Delete an Aggregation record by id recursively, meaning all linked entities bellow Aggregations in the relational
     * hiearchy are also deleted recursively.
     * @param id 
     */
    @Path("recursive/:id")
    @DELETE
    public async deleteAggregationRecursive(@PathParam("id") id: string): Promise<IAggregationModel> {
        return await this.aggregationRepository.deleteRecursive(id);
    }

    /**
     * Return an Aggregation containing the given User id.
     * @param id 
     */
    @Path("byUser/:id")
    @GET
    public async getAggregationsByUser(@PathParam("id") id: string): Promise<Array<IAggregationModel>> {
        return await this.aggregationRepository.getAggsByUser(id);
    }

    /**
     * Return an Aggregation containing the given Job id.
     * @param id 
     */
    @Path("byJob/:id")
    @GET
    public async getAggregationsByJob(@PathParam("id") id: string): Promise<Array<IAggregationModel>> {
        return await this.aggregationRepository.getAggsByJob(id);
    }
}
