import { Injectable } from '@angular/core';
import { IAggregationModel } from '../../../../mongodb-service/src/models/aggregationModel';
import { IPlotModel } from '../../../../mongodb-service/src/models/plotModel';
import { IFilterModel } from '../../../../mongodb-service/src/models/filterModel';
import { IClusterModel } from '../../../../mongodb-service/src/models/clusterModel';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  aggregations: IAggregationModel[];
  generalPlots: IPlotModel[];
  aggregationFilters: IFilterModel[];
  aggregationClusters: IClusterModel[];

  constructor() { }

  public removeAggregation(aggregation:IAggregationModel) {
    this.aggregations = this.aggregations.filter(obj => obj !== aggregation);
    this.aggregationFilters = this.aggregationFilters.filter(obj => obj.aggName !== aggregation.name);
    this.aggregationClusters = this.aggregationClusters.filter(obj => obj.aggName !== aggregation.name);
  }
}
