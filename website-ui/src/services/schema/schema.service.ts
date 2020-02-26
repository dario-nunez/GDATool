import { Injectable } from '@angular/core';
import { ISchema } from 'src/models/schema.model';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  // Default values for testing purposes
  featureColumns: Array<[string, string]> = [["city", "string"], ["county", "string"], ["price", "integer"]];
  metricColumns: Array<[string, string]> = [["price", "integer"]];
  schema: ISchema;
  //schema: ISchema = JSON.parse('{ "datasetName": "s3a://gdatool/5e2c08660b9caf1d7675a3f8/5e2c095462f6b21db965a34b/raw/pp-2018-part1.csv", "schema": [ { "name": "Id", "type": "string", "range": [ "{7E86B6FB-B775-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B773-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B77A-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B774-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B776-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B779-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B778-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B777-458C-E053-6B04A8C0C84C}", "{7E86B6FB-B772-458C-E053-6B04A8C0C84C}" ] }, { "name": "price", "type": "integer", "range": [ "88000.1", "2149615.0" ] }, { "name": "transferDate", "type": "string", "range": [ "2018-11-30 00:00", "2018-11-01 00:00", "2018-12-05 00:00", "2018-10-26 00:00", "2018-12-14 00:00", "2018-11-02 00:00", "2018-08-03 00:00", "2018-11-22 00:00" ] }, { "name": "postcode", "type": "string", "range": [ "S80 1JQ", "NG18 2RU", "S80 3EW", "NG19 7JZ", "NG4 3AZ", "NG1 4FQ", "NG17 3EP", "NG2 2JR", "NG9 1QP" ] }, { "name": "propertyType", "type": "string", "range": [ "F", "T", "O", "D", "S" ] }, { "name": "oldOrNew", "type": "string", "range": [ "N" ] }, { "name": "duration", "type": "string", "range": [ "F", "L" ] }, { "name": "paon", "type": "string", "range": [ "11", "42", "MANSFIELD NETWORK CENTRE", "28", "31", "38", "1", "HILLTOP, 41", "2" ] }, { "name": "saon", "type": "string", "range": [ "null", "UNIT 5" ] }, { "name": "street", "type": "string", "range": [ "CONCORDE WAY", "ALFORD CLOSE", "HAZELWOOD GROVE", "MANOR GREEN", "BRIDGE STREET", "ARKWRIGHT STREET", "WEST HILL", "CAVENDISH STREET", "SHAKESPEARE STREET" ] }, { "name": "locality", "type": "string", "range": [ "null", "CARLTON", "BEESTON" ] }, { "name": "city", "type": "string", "range": [ "WORKSOP", "SUTTON-IN-ASHFIELD", "MANSFIELD", "NOTTINGHAM" ] }, { "name": "district", "type": "string", "range": [ "GEDLING", "CITY OF NOTTINGHAM", "MANSFIELD", "BASSETLAW", "BROXTOWE", "ASHFIELD" ] }, { "name": "county", "type": "string", "range": [ "CITY OF NOTTINGHAM", "NOTTINGHAMSHIRE" ] }, { "name": "ppdCategoryType", "type": "string", "range": [ "B" ] }, { "name": "recordStatus", "type": "string", "range": [ "A" ] } ] }');

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
