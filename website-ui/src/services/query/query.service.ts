import { Injectable } from '@angular/core';
import { IAggregation } from 'src/models/aggregation.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  aggregations: IAggregation[];
  generalPlots: any[];
  aggregationFilters: any[];
  aggregationClusters: any[];

  constructor() { }
}
