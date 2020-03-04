import { Component, OnInit } from '@angular/core';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';
import { IColumn } from 'src/models/column.model';
import { IFilterModel } from '../../../../../../mongodb-service/src/models/filterModel';

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
  aggregationIsSelected: boolean = false;
  stringColumnIsChosen: boolean = false;

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

  constructor(public queryService: QueryService, public schemaService: SchemaService) { }

  ngOnInit() {
    this.queryService.aggregationFilters = [];
    this.selectedAggregation = "";
    this.chosenIdentifierColumn = "";
    this.FEATURE_COLUMNS = this.schemaService.featureColumns;
    this.METRIC_COLUMNS = this.schemaService.metricColumns;
    this.availableColumns = this.FEATURE_COLUMNS;

    this.METRIC_COLUMNS.forEach(element => {
      if (this.availableColumns.find(obj => obj[0] == element[0]) == undefined) {
        this.availableColumns.push(element);
      }
    });
  }

  selectAggregation($event, agg) {
    this.aggregationIsSelected = true;
    this.chosenIdentifierColumn = "";
    this.chosenOperator = "";
    this.chosenStringValue = "";
    this.chosenNumericValue = undefined;
    this.numericMin = undefined;
    this.numericMax = undefined;
    this.stringColumnIsChosen = false;
  }

  selectColumn($event, column) {
    let columnType = this.availableColumns.filter(obj => obj[0] == column)[0][1];

    this.availableStringValues = []
    let schemaColumn: IColumn = this.schemaService.getSchema().schema.filter(obj => obj.name == column)[0];

    if (columnType == "string") {
      this.stringColumnIsChosen = true;
      this.availableOperators = this.STRING_OPERATORS;
      this.availableStringValues = schemaColumn.range;
    } else {
      this.stringColumnIsChosen = false;
      this.availableOperators = this.NUMERIC_OPERATORS;
      this.numericMin = +schemaColumn.range[0];
      this.numericMax = +schemaColumn.range[1];
    }

    this.chosenOperator = "";
    this.chosenStringValue = "";
    this.chosenNumericValue = undefined;
  }

  addFilter() {
    let sqlString;
    let columnType = this.availableColumns.filter(obj => obj[0] == this.chosenIdentifierColumn)[0][1];

    if (columnType == "string") {
      switch (this.chosenOperator) {
        case ("include"):
          sqlString = this.chosenIdentifierColumn + " = '" + this.chosenStringValue + "'";
          break;
        default:
          sqlString = this.chosenIdentifierColumn + " != '" + this.chosenStringValue + "'";
      }
    } else {
      sqlString = this.chosenIdentifierColumn + " " + this.chosenOperator + " " + this.chosenNumericValue;
    }

    const newFilter: IFilterModel = {
      aggName: this.selectedAggregation,
      query: sqlString
    }

    this.selectedAggregation = "";
    this.chosenIdentifierColumn = "";
    this.chosenOperator = "";
    this.chosenStringValue = "";
    this.chosenNumericValue = undefined;
    this.numericMin = undefined;
    this.numericMax = undefined;

    this.aggregationIsSelected = false;
    this.stringColumnIsChosen = false;

    this.queryService.aggregationFilters.push(newFilter);
  }

  deleteFilter(event, filter) {
    this.queryService.aggregationFilters = this.queryService.aggregationFilters.filter(obj => obj !== filter);
  }
}
