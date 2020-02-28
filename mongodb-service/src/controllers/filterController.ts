import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST } from "typescript-rest";
import { IFilter, IFilterModel } from "../models/filterModel";
import { FilterRepository } from "../repositories/filterRepository";
import { Controller } from "./controller";

@Path("/ms/filter")
export class FilterController extends Controller<IFilter> {
    constructor(@Inject private filterRepository: FilterRepository) {
        super(filterRepository);
    }

    @Path("getAll")
    @GET
    public async getAllFilters(): Promise<Array<IFilterModel>> {
        return await this.filterRepository.getAll();
    }

    @Path("byAgg/:id")
    @GET
    public async getFiltersByAggId(@PathParam("id") id: string): Promise<Array<IFilterModel>> {
        return await this.filterRepository.getFiltersByAggId(id);
    }

    @Path("/multiple")
    @POST
    public async createMultipleFilters(filters: Array<IFilterModel>): Promise<Array<IFilterModel>> {
        return await this.filterRepository.createMultipleFilters(filters);
    }

    @POST
    public async createFilter(cluster: IFilterModel): Promise<IFilterModel> {
        return await this.filterRepository.create(cluster);
    }

    @Path(":id")
    @DELETE
    public async deleteAggregation(@PathParam("id") id: string): Promise<IFilterModel> {
        return await this.filterRepository.delete(id);
    }
}