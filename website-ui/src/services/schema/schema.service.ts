import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  featureColumns: Array<[string, string]> = [];
  metricColumns: Array<[string, string]> = [];

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
