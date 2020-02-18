import { Component, OnInit, Input } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from 'src/services/schema/schema.service';
import { QueryService } from 'src/services/query/query.service';
import { IJob } from 'src/models/job.model';
import { IAggregation } from 'src/models/aggregation.model';

@Component({
  selector: 'app-aggregations',
  templateUrl: './aggregations.component.html',
  styleUrls: ['./aggregations.component.css']
})
export class AggregationsComponent implements OnInit {
  metricSelected: boolean = false;
  jobId: string;
  public job: IJob;

  FEATURE_COLUMNS: Array<string> = [];
  OPERATIONS: Array<string> = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
  METRIC_COLUMNS: Array<string> = [];

  aggregations: IAggregation[];
  currentAggregationName: string;
  currentAggregationMetricColumn: string;

  possibleFeatureColumns: Array<string> = [];
  possibleAggs: Array<string> = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
  possibleMetricColumns: Array<string> = [];

  selectedFeatureColumns: Array<string> = [];
  selectedAggregations: Array<string> = [];

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private schemaService: SchemaService, private queryService: QueryService, private router: Router) { }

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
        let agg: IAggregation = {
          aggs: this.OPERATIONS,
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
    const newAgg: IAggregation = {
      aggs: this.selectedAggregations,
      featureColumns: this.selectedFeatureColumns,
      jobId: this.jobId,
      metricColumn: this.currentAggregationMetricColumn,
      name: this.currentAggregationName,
      sortColumnName: this.selectedFeatureColumns[0]
    }

    console.log("Agg created");
    this.queryService.aggregations.push(newAgg);
    console.log(this.queryService.aggregations);

    this.currentAggregationMetricColumn = "Choose one";
    this.currentAggregationName = "";
    this.possibleAggs = this.OPERATIONS;
    this.possibleFeatureColumns = this.FEATURE_COLUMNS;
    this.possibleMetricColumns = this.METRIC_COLUMNS;
    this.selectedFeatureColumns = [];
    this.selectedAggregations = [];

    this.metricSelected = false;
  }

  deleteAggregation(event, agg: any) {
    this.queryService.aggregations = this.queryService.aggregations.filter(obj => obj !== agg);
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

  selectMetricColumn(event, element) {
    console.log("metric column: " + element);
    this.selectedFeatureColumns = []
    this.possibleFeatureColumns = this.FEATURE_COLUMNS.filter(obj => obj !== element);
    this.metricSelected = true;
  }
}
