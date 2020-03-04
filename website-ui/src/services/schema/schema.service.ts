import { Injectable } from '@angular/core';
import { ISchema } from 'src/models/schema.model';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  // Default values for testing purposes
  featureColumns: Array<[string, string]> = [];
  metricColumns: Array<[string, string]> = [];
  schema: ISchema;

  getFeatureColumns() {
    return this.featureColumns;
  }

  getMetricColumns() {
    return this.metricColumns;
  }

  getSchema() {
    return this.schema;
  }

  setFeatureColumns(newFeatureColumns: Array<[string, string]>) {
    this.featureColumns = newFeatureColumns;
  }

  setMetricColumns(newMetricColumns: Array<[string, string]>) {
    this.metricColumns = newMetricColumns;
  }
}
