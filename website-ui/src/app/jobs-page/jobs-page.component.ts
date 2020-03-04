import { Component, OnInit } from '@angular/core';
import { IJobModel } from '../../../../mongodb-service/src/models/jobModel';
import { MongodbService } from 'src/services/mongodb/mongodb.service';

@Component({
  selector: 'app-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit {
  jobs: IJobModel[] = [];

  constructor(public mongodbService: MongodbService) { }

  ngOnInit() {
    this.mongodbService.getJobsByUserId(JSON.parse(localStorage.getItem("user"))._id).subscribe(retJobs => {
      this.jobs = retJobs;
    });
  }
}
