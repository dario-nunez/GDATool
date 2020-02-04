import Aggregation, { IAggregation } from "../models/aggregationModel";
import { Repository } from "./repository";

export class AggregationRepository extends Repository<IAggregation> {
    constructor() {
        super(Aggregation);
    }
}
