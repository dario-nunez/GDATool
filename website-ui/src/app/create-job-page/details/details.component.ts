import { Component, OnInit } from '@angular/core';
import { IJob } from 'src/models/job.model';
import { IAggregation } from 'src/models/aggregation.model';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  job: IJob;
  aggregations: IAggregation[];
  customAggregations: boolean;
  currentAggregationName: string;
  currentAggregationMetricColumn: string;

  constructor(private mongodbService: MongodbService, private router: Router) { }

  ngOnInit() {
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
  }

  createJob() {
    // this.mongodbService.createJob(this.job).subscribe(retJob => {
    //   console.log("Job details saved");
    //   this.router.navigate(['/upload']);
    // });
    this.router.navigate(['/upload']);
  }
}
