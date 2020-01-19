import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';
import { IJob } from 'src/models/job.model';
import { IAggregation } from 'src/models/aggregation.model';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})

export class QueryComponent implements OnInit {
  FEATURE_COLUMNS: Array<string> = ["city", "county", "id"];
  OPERATIONS: Array<string> = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
  METRIC_COLUMNS: Array<string> = ["price"];

  job: IJob;
  aggregations: IAggregation[];
  currentAggregationName: string;
  currentAggregationMetricColumn: string;

  possibleFeatureColumns: Array<string> = ["city", "county", "id"];
  possibleAggs: Array<string> = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
  possibleMetricColumns: Array<string> = ["price"];

  selectedFeatureColumns: Array<string> = [];
  selectedAggregations: Array<string> = [];

  constructor(private mongodbService: MongodbService, private router: Router) { }

  ngOnInit() {
    this.currentAggregationName = "";
    this.currentAggregationMetricColumn = "Choose one";

    this.job = {
      name: "",
      description: "",
      rawInputDirectory: "raw",
      stagingFileName: "staging",
      userId: JSON.parse(localStorage.getItem("user")).id,
      generateESIndices: true,
      jobStatus: "",
      runs: []
    }

    this.aggregations = [];

    this.addDefaultAggregations();
  }

  addDefaultAggregations() {
    for (let mc of this.METRIC_COLUMNS) {
      for (let fc of this.FEATURE_COLUMNS) {
        let agg: IAggregation = {
          aggs: this.OPERATIONS,
          featureColumns: [fc],
          jobId: this.job._id,
          metricColumn: mc,
          name: "Aggregation of " + fc + " by " + mc,
          sortColumnName: fc
        }

        this.aggregations.push(agg);
      }
    }
  }

  createAggregation() {
    const newAgg: IAggregation = {
      aggs: this.selectedAggregations,
      featureColumns: this.selectedFeatureColumns,
      jobId: "tbd",
      metricColumn: this.currentAggregationMetricColumn,
      name: this.currentAggregationName,
      sortColumnName: this.currentAggregationMetricColumn
    }

    console.log("Agg created");
    this.aggregations.push(newAgg);
    console.log(this.aggregations);

    this.currentAggregationMetricColumn = "Choose one";
    this.currentAggregationName = "";
    this.possibleAggs = this.OPERATIONS;
    this.possibleFeatureColumns = this.FEATURE_COLUMNS;
    this.possibleMetricColumns = this.METRIC_COLUMNS;
    this.selectedFeatureColumns = [];
    this.selectedAggregations = [];
  }

  deleteAggregation(event, agg: any) {
    this.aggregations = this.aggregations.filter(obj => obj !== agg);
  }

  addElement(event, element: string, type: string) {
    if (type == "aggregation") {
      if (!this.selectedAggregations.includes(element)) {
        this.selectedAggregations.push(element);
      }
      this.possibleAggs = this.possibleAggs.filter(obj => obj !== element);
    } else {
      if (!this.selectedFeatureColumns.includes(element)) {
        this.selectedFeatureColumns.push(element);
      }

      this.possibleFeatureColumns = this.possibleFeatureColumns.filter(obj => obj !== element);
    }
  }

  removeElement(event, element: string, type: string) {
    if (type == "aggregation") {
      this.selectedAggregations = this.selectedAggregations.filter(obj => obj !== element);
      if (!this.possibleAggs.includes(element)) {
        this.possibleAggs.push(element);
      }
    } else {
      this.selectedFeatureColumns = this.selectedFeatureColumns.filter(obj => obj !== element);
      if (!this.possibleFeatureColumns.includes(element)) {
        this.possibleFeatureColumns.push(element);
      }
    }
  }

  createJob() {
    
  }

  next() {
    this.router.navigate(['/execute']);
  }
}
