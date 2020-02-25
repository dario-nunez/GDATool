import { Controller } from "../../../common-service/src/controllers/controller";
import { Inject } from "typescript-ioc";
import { GET, Path, POST, PathParam } from "typescript-rest";
import { FilterRepository } from "../../../common-service/src/repositories/filterRepository";
import { IFilterModel, IFilter } from "../../../common-service/src/models/filterModel";

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
    public async createMultipleFilters(filters: IFilterModel[]): Promise<IFilterModel[]> {
        return await this.filterRepository.createMultipleFilters(filters);
    }

    @POST
    public async createFilter(cluster: IFilterModel): Promise<IFilterModel> {
        return await this.filterRepository.create(cluster);
    }
}