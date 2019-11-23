import { Component, OnInit } from '@angular/core';
import { IJob } from 'src/models/job.model';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';
import { IAggregation } from 'src/models/aggregation.model';

@Component({
  selector: 'app-create-job-page',
  templateUrl: './create-job-page.component.html',
  styleUrls: ['./create-job-page.component.css']
})
export class CreateJobPageComponent implements OnInit {
  FEATURE_COLUMNS: Array<string> = ["city", "county", "id"];
  AGGS: Array<string> = ["SUM", "AVG", "MAX"];
  METRIC_COLUMNS: Array<string> = ["price"];

  job: IJob;
  aggregations: IAggregation[];
  customAggregations: boolean;
  currentAggregationName: string;
  currentAggregationMetricColumn: string;

  possibleFeatureColumns: Array<string> = ["city", "county", "id"];
  possibleAggs: Array<string> = ["SUM", "AVG", "MAX"];
  possibleMetricColumns: Array<string> = ["price"];

  selectedFeatureColumns: Array<string> = [];
  selectedAggregations: Array<string> = [];

  constructor(private mongodbService: MongodbService, private router: Router) { }

  ngOnInit() {
    this.customAggregations = false;
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

    const mockAggregation: IAggregation = {
      aggs: ["SUM", "AVG", "MAX"],
      featureColumns: ["city", "county"],
      jobId: "121212121212",
      metricColumn: "price",
      name: "City & County by Price",
      sortColumnName: "price"
    }

    this.aggregations = [];
    // this.aggregations.push(mockAggregation);
  }

  createJob() {
    this.mongodbService.createJob(this.job).subscribe(
      retJob => {
        if (this.customAggregations) {
          for (let agg of this.aggregations) {
            agg.jobId = retJob._id;
          }

          this.mongodbService.createMultipleAggregations(this.aggregations).subscribe(
            aggs => {
              console.log("Job created!");
              this.router.navigate(['/jobsPage']);
            });
        } else {
          let allAggs: IAggregation[] = [];

          for (let mc of this.METRIC_COLUMNS) {
            for (let fc of this.FEATURE_COLUMNS) {
              let agg: IAggregation = {
                aggs: this.AGGS,
                featureColumns: [fc],
                jobId: retJob._id,
                metricColumn: mc,
                name: "Aggregation of " + fc + " by " + mc,
                sortColumnName: fc
              }
  
              allAggs.push(agg);
            }
          }

          this.mongodbService.createMultipleAggregations(allAggs).subscribe(
            aggs => {
              console.log("Job created!");
              this.router.navigate(['/jobsPage']);
            }
          );
        }
      }
    );
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
    this.possibleAggs = this.AGGS;
    this.possibleFeatureColumns = this.FEATURE_COLUMNS;
    this.possibleMetricColumns = this.METRIC_COLUMNS;
    this.selectedFeatureColumns = [];
    this.selectedAggregations = [];
  }

  deleteAggregation() {

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
}
