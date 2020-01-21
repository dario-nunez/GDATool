import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  featureColumns: Array<string> = [];
  metricColumns: Array<string> = [];

  constructor() { }

  getFeatureColumns() {
    return this.featureColumns;
  }

  getMetricColumns() {
    return this.metricColumns;
  }

  setFeatureColumns(newFeatureColumns: Array<string>) {
    this.featureColumns = newFeatureColumns;
  }

  setMetricColumns(newMetricColumns: Array<string>) {
    this.metricColumns = newMetricColumns;
  }
}
