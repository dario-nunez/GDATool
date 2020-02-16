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
  metricSelected: boolean = false;
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

    this.aggregations = [];

    // Load job information and generate default aggregations
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
      for (let fc of this.FEATURE_COLUMNS.filter(obj => obj !== mc)) {
        let agg: IAggregation = {
          aggs: this.OPERATIONS,
          featureColumns: [fc],
          jobId: this.job._id,
          metricColumn: mc,
          name: "Aggregation of " + mc + " by " + fc,
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
      sortColumnName: this.selectedFeatureColumns[0]
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

    this.metricSelected = false;
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

  selectMetricColumn(event, element) {
    console.log("metric column: " + element);
    this.possibleFeatureColumns = this.FEATURE_COLUMNS.filter(obj => obj !== element);
    this.metricSelected = true;
  }

  next() {
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      this.mongodbService.createMultipleAggregations(this.aggregations).subscribe(aggs => {
        console.log("Aggregations added");
        this.router.navigate(['/execute', this.jobId]);
      });
    });
  }

  deleteJob() {
    if (confirm("This job will be lost forever. Are you sure you want to delete it?")) {
      this.mongodbService.deleteJobRecusrive(this.job._id).subscribe(job => {
        console.log("Deleted Job: ");
        console.log(job);
        this.router.navigate(['/jobsPage']);
      });
    }
  }
}
