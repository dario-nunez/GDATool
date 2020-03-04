import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';
import { IJobModel } from '../../../../../mongodb-service/src/models/jobModel';
import { IAggregationModel } from '../../../../../mongodb-service/src/models/aggregationModel';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  job: IJobModel;
  aggregations: IAggregationModel[];
  customAggregations: boolean;
  currentAggregationName: string;
  currentAggregationMetricColumn: string;

  constructor(public mongodbService: MongodbService, private router: Router) { }

  ngOnInit() {
    let loggedInUserId;
    if (JSON.parse(localStorage.getItem("user"))) {
      loggedInUserId = JSON.parse(localStorage.getItem("user"))._id;
    } else {
      loggedInUserId = "Nope";
    }

    this.job = {
      name: "",
      description: "",
      rawInputDirectory: "",
      stagingFileName: "",
      userId: loggedInUserId,
      generateESIndices: true,
      jobStatus: 1,
    }
  }

  createJob() {
    this.mongodbService.createJob(this.job).subscribe(retJob => {
      this.router.navigate(['/upload', retJob._id]);
    });
  }
}
