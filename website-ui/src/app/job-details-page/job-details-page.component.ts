import { Component, OnInit } from '@angular/core';
import { IJob } from 'src/models/job.model';

@Component({
  selector: 'app-job-details-page',
  templateUrl: './job-details-page.component.html',
  styleUrls: ['./job-details-page.component.css']
})
export class JobDetailsPageComponent implements OnInit {

  job: IJob;

  constructor() { }

  ngOnInit() {
    
    this.getJob();
  }

  getJob() {
    this.job = {
      _id: "e5362300-bf75-11e9-909f-6f48786f343d",
      name: "UK Properties",
      description: "Sold properties in UK cities",
      rawInputDirectory: "raw",
      stagingFielName: "staging",
      userId: "121212121212121212121212",
      jobStatus: "success",
      runs: [
        {
          timeStarted: new Date(),
          timeFinished: new Date(),
          runStatus: "success"
        },
        {
          timeStarted: new Date(),
          timeFinished: new Date(),
          runStatus: "success"
        },
        {
          timeStarted: new Date(),
          timeFinished: new Date(),
          runStatus: "fail"
        }
      ]
    }
  }
}
