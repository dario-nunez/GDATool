import { Component, OnInit, Input } from '@angular/core';
import { SchemaService } from 'src/services/schema/schema.service';
import { IPlot } from 'src/models/plot.model';
import { QueryService } from 'src/services/query/query.service';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IAggregation } from 'src/models/aggregation.model';
import { ICluster } from 'src/models/cluster.model';
import { IJobModel } from '../../../../../../mongodb-service/src/models/jobModel';

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

  constructor(private route: ActivatedRoute, private queryService: QueryService, private router: Router) { }

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
    let chosenAgg: IAggregation = this.queryService.aggregations.filter(obj => obj.name === agg)[0];
    
    this.OPERATIONS = chosenAgg.aggs;
    this.xAvailableColumns = chosenAgg.aggs;
    this.yAvailableColumns = chosenAgg.aggs;
    this.FEATURE_COLUMNS = chosenAgg.featureColumns;
    this.aggregationSelected = true;
  }

  addCluster() {
    let chosenAgg: IAggregation = this.queryService.aggregations.filter(obj => obj.name === this.selectedAggregation)[0];
    const newCluster: ICluster = {
      aggName: chosenAgg.name,
      identifier: this.chosenIdentifierColumn,
      identifierType: "nominal",
      xAxis: this.chosenXColumn,
      xType: "quantitative",
      yAxis: this.chosenYColumn,
      yType: "quantitative",
      cluster: 0
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

