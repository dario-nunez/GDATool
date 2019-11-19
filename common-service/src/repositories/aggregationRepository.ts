import { Repository } from "./repository";
import Aggregation, { IAggregation } from "../models/aggregationModel";

export class AggregationRepository extends Repository<IAggregation> {
    constructor() {
        super(Aggregation);
    }
}
