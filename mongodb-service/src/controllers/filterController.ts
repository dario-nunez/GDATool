import { Inject } from "typescript-ioc";
import { GET, Path, PathParam, POST } from "typescript-rest";
import { Controller } from "../../../common-service/src/controllers/controller";
import { IFilter, IFilterModel } from "../../../common-service/src/models/filterModel";
import { FilterRepository } from "../../../common-service/src/repositories/filterRepository";

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
    public async getFiltersByAggId(@PathParam("id") id: string): Promise<IFilterModel> {
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
}