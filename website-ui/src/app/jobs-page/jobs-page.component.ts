import { Component, OnInit } from '@angular/core';
import { IJob } from '../../models/job.model';

@Component({
  selector: 'app-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit {

  jobs: IJob[];

  constructor() { }

  ngOnInit() {
    this.getJobsByUser();
  }

  getJobsByUser() {
    this.jobs = [
      {
        _id: "e5362300-bf75-11e9-909f-6f48786f343d",
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
            runStatus: "success"
          }
        ]
      } as IJob,
      {
        _id: "Jobxyzxyzxyzxyzxyzxyzxyz",
        description: "Stock changes",
        rawInputDirectory: "raw",
        stagingFielName: "staging",
        userId: "222222222222222222222222",
        jobStatus: "pending",
        runs: [
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "pending"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "fail"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "success"
          }
        ]
      } as IJob,
      {
        _id: "Jobabcabcabcabcabcbac",
        description: "August temperature",
        rawInputDirectory: "raw",
        stagingFielName: "staging",
        userId: "333333333333333333333333",
        jobStatus: "pending",
        runs: [
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "pending"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "fail"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "fail"
          }
        ]
      } as IJob,
      {
        _id: "Job123123123123123123",
        description: "1st Quarter Sales",
        rawInputDirectory: "raw",
        stagingFielName: "staging",
        userId: "444444444444444444444444",
        jobStatus: "failed",
        runs: [
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "fail"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "success"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "success"
          }
        ]
      } as IJob,
      {
        _id: "Jobxyzxyzxyzxyzxyzxyzxyz",
        description: "Coke vs Pepsi",
        rawInputDirectory: "raw",
        stagingFielName: "staging",
        userId: "555555555555555555555555",
        jobStatus: "failed",
        runs: [
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "fail"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "pending"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "pending"
          }
        ]
      } as IJob,
      {
        _id: "Jobabcabcabcabcabcbac",
        description: "Political parties per city",
        rawInputDirectory: "raw",
        stagingFielName: "staging",
        userId: "666666666666666666666666",
        jobStatus: "pending",
        runs: [
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "pending"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "success"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "success"
          }
        ]
      } as IJob,
      {
        _id: "Job123123123123123123",
        description: "March sales",
        rawInputDirectory: "raw",
        stagingFielName: "staging",
        userId: "777777777777777777777777",
        jobStatus: "pending",
        runs: [
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "pending"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "fail"
          },
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "success"
          }
        ]
      } as IJob,
      {
        _id: "Jobxyzxyzxyzxyzxyzxyzxyz",
        description: "April sales",
        rawInputDirectory: "raw",
        stagingFielName: "staging",
        userId: "888888888888888888888888",
        jobStatus: "pending",
        runs: [
          {
            timeStarted: new Date(),
            timeFinished: new Date(),
            runStatus: "pending"
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
      } as IJob
    ];
  }
}
