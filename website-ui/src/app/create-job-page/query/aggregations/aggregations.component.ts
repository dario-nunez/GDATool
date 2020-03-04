import { Component, OnInit, Input } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from 'src/services/schema/schema.service';
import { QueryService } from 'src/services/query/query.service';
import { IJobModel } from '../../../../../../mongodb-service/src/models/jobModel';
import { IAggregationModel } from '../../../../../../mongodb-service/src/models/aggregationModel';

@Component({
  selector: 'app-aggregations',
  templateUrl: './aggregations.component.html',
  styleUrls: ['./aggregations.component.css']
})
export class AggregationsComponent implements OnInit {
  metricIsSelected: boolean = false;
  jobId: string;
  job: IJobModel;
  FEATURE_COLUMNS: Array<string> = [];
  OPERATIONS: Array<string> = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
  METRIC_COLUMNS: Array<string> = [];
  aggregations: IAggregationModel[];
  currentAggregationName: string;
  currentAggregationMetricColumn: string;
  possibleFeatureColumns: Array<string> = [];
  possibleOperations: Array<string> = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
  possibleMetricColumns: Array<string> = [];
  selectedFeatureColumns: Array<string> = [];
  selectedOperations: Array<string> = [];

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private schemaService: SchemaService, public queryService: QueryService, private router: Router) { }

  ngOnInit() {
    // Load feature columns
    this.schemaService.featureColumns.forEach(element => {
      this.FEATURE_COLUMNS.push(element[0]);
      this.possibleFeatureColumns.push(element[0]);
    });

    // Load metric columns
    this.schemaService.metricColumns.forEach(element => {
      this.METRIC_COLUMNS.push(element[0]);
      this.possibleMetricColumns.push(element[0]);
    });

    this.currentAggregationName = "";
    this.currentAggregationMetricColumn = "";

    this.queryService.aggregations = [];

    // Load job information and generate default aggregations
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.mongodbService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
        this.addDefaultAggregations();
      });
    });
  }

  addDefaultAggregations() {
    for (let mc of this.METRIC_COLUMNS) {
      for (let fc of this.FEATURE_COLUMNS.filter(obj => obj !== mc)) {
        let agg: IAggregationModel = {
          operations: this.OPERATIONS,
          featureColumns: [fc],
          jobId: this.job._id,
          metricColumn: mc,
          name: "Aggregation of " + mc + " by " + fc,
          sortColumnName: fc
        }
        this.queryService.aggregations.push(agg);
      }
    }
  }

  createAggregation() {
    // Reset the name field to blank if the name is already taken
    if (this.queryService.aggregations.find(obj => obj.name === this.currentAggregationName) != null) {
      this.currentAggregationName = "";
    } else {
      const newAgg: IAggregationModel = {
        operations: this.selectedOperations,
        featureColumns: this.selectedFeatureColumns,
        jobId: this.jobId,
        metricColumn: this.currentAggregationMetricColumn,
        name: this.currentAggregationName,
        sortColumnName: this.selectedFeatureColumns[0]
      }

      this.queryService.aggregations.push(newAgg);

      this.currentAggregationMetricColumn = "Choose one";
      this.currentAggregationName = "";
      this.possibleOperations = this.OPERATIONS;
      this.possibleFeatureColumns = this.FEATURE_COLUMNS;
      this.possibleMetricColumns = this.METRIC_COLUMNS;
      this.selectedFeatureColumns = [];
      this.selectedOperations = [];
      this.metricIsSelected = false;
    }
  }

  deleteAggregation(event, agg: IAggregationModel) {
    this.queryService.removeAggregation(agg);
  }

  addElement(event, element: string, type: string) {
    if (type == "aggregation") {
      if (!this.selectedOperations.includes(element)) {
        this.selectedOperations.push(element);
      }
      this.possibleOperations = this.possibleOperations.filter(obj => obj !== element);
    } else {
      if (!this.selectedFeatureColumns.includes(element)) {
        this.selectedFeatureColumns.push(element);
      }

      this.possibleFeatureColumns = this.possibleFeatureColumns.filter(obj => obj !== element);
    }
  }

  removeElement(event, element: string, type: string) {
    if (type == "aggregation") {
      this.selectedOperations = this.selectedOperations.filter(obj => obj !== element);
      if (!this.possibleOperations.includes(element)) {
        this.possibleOperations.push(element);
      }
    } else {
      this.selectedFeatureColumns = this.selectedFeatureColumns.filter(obj => obj !== element);
      if (!this.possibleFeatureColumns.includes(element)) {
        this.possibleFeatureColumns.push(element);
      }
    }
  }

  selectMetricColumn(event, element) {
    this.selectedFeatureColumns = []
    this.possibleFeatureColumns = this.FEATURE_COLUMNS.filter(obj => obj !== element);
    this.metricIsSelected = true;
  }
}
