import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  featureColumns: Array<[string, string]> = [["city", "string"], ["county", "string"]];
  metricColumns: Array<[string, string]> = [["price", "integer"]];

  constructor() { }

  getFeatureColumns() {
    return this.featureColumns;
  }

  getMetricColumns() {
    return this.metricColumns;
  }

  setFeatureColumns(newFeatureColumns: Array<[string, string]>) {
    this.featureColumns = newFeatureColumns;
  }

  setMetricColumns(newMetricColumns: Array<[string, string]>) {
    this.metricColumns = newMetricColumns;
  }
}
