import { Component, OnInit } from '@angular/core';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';
import { IAggregation } from 'src/models/aggregation.model';
import { IColumn } from 'src/models/column.model';
import { IFilter } from 'src/models/filter.model';

@Component({
  selector: 'app-aggregation-filtering',
  templateUrl: './aggregation-filtering.component.html',
  styleUrls: ['./aggregation-filtering.component.css']
})
export class AggregationFilteringComponent implements OnInit {
  NUMERIC_OPERATORS = ["<", "<=", ">", ">=", "=", "!="]
  STRING_OPERATORS = ["exclude", "include"]
  FEATURE_COLUMNS = [];
  METRIC_COLUMNS = [];
  aggregationSelected: boolean = false;
  stringColumnChosen: boolean = false;
  
  availableColumns: Array<[string, string]> = [];
  availableOperators: Array<string> = [];
  availableStringValues: Array<string> = [];
  numericMin: number;
  numericMax: number;

  selectedAggregation: string;
  chosenIdentifierColumn: string;
  chosenOperator: string;
  chosenStringValue: string;
  chosenNumericValue: number;

  constructor(private queryService: QueryService, private schemaService: SchemaService) { }

  ngOnInit() {
    this.queryService.aggregationFilters = [];
    this.selectedAggregation = "";
    this.chosenIdentifierColumn = "";

    this.FEATURE_COLUMNS = this.schemaService.featureColumns;
    this.METRIC_COLUMNS = this.schemaService.metricColumns;

    this.availableColumns = this.FEATURE_COLUMNS.concat(this.METRIC_COLUMNS);

    console.log(this.schemaService.getSchema().schema);
  }

  selectAggregation($event, agg) {
    let chosenAgg: IAggregation = this.queryService.aggregations.filter(obj => obj.name === agg)[0];

    this.aggregationSelected = true;
  }

  selectColumn($event, column) {
    let columnType = this.availableColumns.filter(obj => obj[0] == column)[0][1];

    this.availableStringValues = []
    let schemaColumn:IColumn = this.schemaService.getSchema().schema.filter(obj => obj.name == column)[0];

    if (columnType == "string") {
      this.stringColumnChosen = true;
      this.availableOperators = this.STRING_OPERATORS;
      this.availableStringValues = schemaColumn.range;
      console.log(this.availableStringValues)
    } else {
      this.stringColumnChosen = false;
      this.availableOperators = this.NUMERIC_OPERATORS;
      this.numericMin = +schemaColumn.range[0];
      this.numericMax = +schemaColumn.range[1];

      console.log(this.numericMin + " " + this.numericMax)
    }

    this.chosenOperator = "";
    this.chosenStringValue = "";
    this.chosenNumericValue = undefined;
  }

  addFilter() {
    let chosenAgg: IAggregation = this.queryService.aggregations.filter(obj => obj.name === this.selectedAggregation)[0];
    let sqlString;
    let columnType = this.availableColumns.filter(obj => obj[0] == this.chosenIdentifierColumn)[0][1];

    if (columnType == "string") {
      switch (this.chosenOperator){
        case ("include"):
          sqlString = this.chosenIdentifierColumn + " = '" + this.chosenStringValue + "'";
          break;
        default:
          sqlString = this.chosenIdentifierColumn + " != '" + this.chosenStringValue + "'";
      }
    } else {
      sqlString = this.chosenIdentifierColumn + " " + this.chosenOperator + " " + this.chosenNumericValue;
    }

    const newFilter: IFilter = {
      aggName: this.selectedAggregation,
      query: sqlString
    }

    console.log(newFilter);

    this.selectedAggregation = "";
    this.chosenIdentifierColumn = "";
    this.chosenOperator = "";
    this.chosenStringValue = "";
    this.chosenNumericValue = undefined;
    this.numericMin = undefined;
    this.numericMax = undefined;

    this.aggregationSelected = false;
    this.stringColumnChosen = false;

    this.queryService.aggregationFilters.push(newFilter);
  }

  deleteFilter(event, filter) {
    this.queryService.aggregationFilters = this.queryService.aggregationFilters.filter(obj => obj !== filter);
  }
}
