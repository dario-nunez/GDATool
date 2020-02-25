import Filter, { IFilter } from "../models/filterModel";
import { Repository } from "./repository";

export class FilterRepository extends Repository<IFilter> {
    constructor() {
        super(Filter);
    }

    public getFiltersByAggId(id: string): Promise<any> {
        return Filter.find({aggId: id}).exec();
    }

    public async createMultipleFilters(filters: Array<any>): Promise<Array<IFilter>> {
        for (const filter of filters) {
            this.create(filter);
        }

        return filters;
    }
}