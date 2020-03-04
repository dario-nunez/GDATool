import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST } from "typescript-rest";
import { IFilter, IFilterModel } from "../models/filterModel";
import { FilterRepository } from "../repositories/filterRepository";
import { Controller } from "./controller";

/**
 * Filter endpoints rooted at "/ms/filter".
 */
@Path("/ms/filter")
export class FilterController extends Controller<IFilter> {
    constructor(@Inject private filterRepository: FilterRepository) {
        super(filterRepository);
    }

    /**
     * Return all filters.
     */
    @Path("getAll")
    @GET
    public async getAllFilters(): Promise<Array<IFilterModel>> {
        return await this.filterRepository.getAll();
    }

    /**
     * Return a collection of filters linked to a given Aggregation id.
     * @param id
     */
    @Path("byAgg/:id")
    @GET
    public async getFiltersByAggId(@PathParam("id") id: string): Promise<Array<IFilterModel>> {
        return await this.filterRepository.getFiltersByAggId(id);
    }

    /**
     * Store a collection of Filters.
     * @param filters
     */
    @Path("/multiple")
    @POST
    public async createMultipleFilters(filters: Array<IFilterModel>): Promise<Array<IFilterModel>> {
        return await this.filterRepository.createMultipleFilters(filters);
    }

    /**
     * Store a single Filter.
     * @param filter 
     */
    @POST
    public async createFilter(filter: IFilterModel): Promise<IFilterModel> {
        return await this.filterRepository.create(filter);
    }

    /**
     * Delete a Filter by id.
     * @param id 
     */
    @Path(":id")
    @DELETE
    public async deleteFilter(@PathParam("id") id: string): Promise<IFilterModel> {
        return await this.filterRepository.delete(id);
    }
}