import { Component, OnInit, Input } from '@angular/core';
import { QueryService } from 'src/services/query/query.service';
import { IJobModel } from '../../../../../../mongodb-service/src/models/jobModel';
import { IAggregationModel } from '../../../../../../mongodb-service/src/models/aggregationModel';
import { IClusterModel } from '../../../../../../mongodb-service/src/models/clusterModel';

@Component({
  selector: 'app-aggregation-clustering',
  templateUrl: './aggregation-clustering.component.html',
  styleUrls: ['./aggregation-clustering.component.css']
})

export class AggregationClusteringComponent implements OnInit {
  public job: IJobModel;
  aggregationSelected: boolean = false;

  chosenXColumn: string;
  chosenYColumn: string;
  chosenIdentifierColumn: string;

  OPERATIONS: Array<string> = [];
  FEATURE_COLUMNS: Array<string> = [];

  xAvailableColumns: Array<string> = [];
  yAvailableColumns: Array<string> = [];

  selectedAggregation: string;

  constructor(public queryService: QueryService) { }

  ngOnInit() {
    this.queryService.aggregationClusters = [];    
    this.selectedAggregation = "";

    this.chosenXColumn = "";
    this.chosenYColumn = "";
    this.chosenIdentifierColumn = "";
  }

  selectXColumn(event, column) {
    this.yAvailableColumns = this.OPERATIONS.filter(obj => obj !== column)
  }

  selectYColumn(event, column) {
    this.xAvailableColumns = this.OPERATIONS.filter(obj => obj !== column)
  }

  selectAggregation(event, agg) {
    let chosenAgg: IAggregationModel = this.queryService.aggregations.filter(obj => obj.name === agg)[0];
    
    this.chosenXColumn = "";
    this.chosenYColumn = "";
    this.chosenIdentifierColumn = "";

    this.OPERATIONS = chosenAgg.operations;
    this.xAvailableColumns = chosenAgg.operations;
    this.yAvailableColumns = chosenAgg.operations;
    this.FEATURE_COLUMNS = chosenAgg.featureColumns;
    this.aggregationSelected = true;
  }

  addCluster() {
    let chosenAgg: IAggregationModel = this.queryService.aggregations.filter(obj => obj.name === this.selectedAggregation)[0];
    const newCluster: IClusterModel = {
      aggName: chosenAgg.name,
      identifier: this.chosenIdentifierColumn,
      identifierType: "nominal",
      xAxis: this.chosenXColumn,
      xType: "quantitative",
      yAxis: this.chosenYColumn,
      yType: "quantitative"
    }

    this.yAvailableColumns = this.OPERATIONS;
    this.xAvailableColumns = this.OPERATIONS;
    this.chosenXColumn = "";
    this.chosenYColumn = "";
    this.chosenIdentifierColumn = "";
    this.selectedAggregation = "";

    this.aggregationSelected = false;

    this.queryService.aggregationClusters.push(newCluster);
  }

  deleteCluster(event, cluster) {
    this.queryService.aggregationClusters = this.queryService.aggregationClusters.filter(obj => obj !== cluster);
  }
} 

