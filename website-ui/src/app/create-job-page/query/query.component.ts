import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IJob } from 'src/models/job.model';
import { IAggregation } from 'src/models/aggregation.model';
import { SchemaService } from 'src/services/schema/schema.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})

export class QueryComponent implements OnInit {
  ioDisabled: boolean = true;
  jobId: string;
  job: IJob;

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

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private schemaService: SchemaService, private router: Router) { }

  ngOnInit() {
    this.FEATURE_COLUMNS = this.schemaService.featureColumns;
    this.possibleFeatureColumns = this.schemaService.featureColumns;
    this.METRIC_COLUMNS = this.schemaService.metricColumns;
    this.possibleMetricColumns = this.schemaService.metricColumns;

    this.currentAggregationName = "";
    this.currentAggregationMetricColumn = "";

    this.aggregations = [];

    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.mongodbService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
        job.jobStatus = 4;
        this.ioDisabled = false;
        this.addDefaultAggregations();
      });
    });
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
      jobId: this.jobId,
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

  next() {
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      this.mongodbService.createMultipleAggregations(this.aggregations).subscribe(aggs => {
        console.log("Aggregations added");
        this.router.navigate(['/execute', this.jobId]);
      });
    });
  }
}
