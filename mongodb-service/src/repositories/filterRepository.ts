import Filter, { IFilter, IFilterModel } from "../models/filterModel";
import { Repository } from "./repository";

/**
 * Extends the base Repository class and adds methods unique to Filters.
 */
export class FilterRepository extends Repository<IFilter> {
    constructor() {
        super(Filter);
    }

    /**
     * Return a collection of Filters given an Aggregation id.
     * @param id 
     */
    public getFiltersByAggId(id: string): Promise<Array<IFilterModel>> {
        return Filter.find({aggId: id}).exec();
    }

    /**
     * Store a collection of Filters.
     * @param filters 
     */
    public async createMultipleFilters(filters: Array<any>): Promise<Array<IFilterModel>> {
        for (const filter of filters) {
            this.create(filter);
        }

        return filters;
    }
}