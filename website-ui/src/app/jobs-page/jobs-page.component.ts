import { Component, OnInit } from '@angular/core';
import { IJob } from '../../models/job.model';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { IRun } from 'src/models/run.model';

@Component({
  selector: 'app-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit {

  jobs: IJob[];
  mockRuns: IRun[];

  constructor(private mongodbService: MongodbService) { }

  ngOnInit() {
    this.getJobsByUser();

    this.mockRuns = [
      {
        timeStarted: new Date(),
        timeFinished: new Date(),
        runStatus: "success"
      },
      {
        timeStarted: new Date(),
        timeFinished: new Date(),
        runStatus: "pending"
      },
      {
        timeStarted: new Date(),
        timeFinished: new Date(),
        runStatus: "fail"
      }
    ]
  }

  getJobsByUser() {
    this.mongodbService.getJobsByUserId(JSON.parse(localStorage.getItem("user")).id).subscribe(
      retJobs => {
        console.log(retJobs);
        if (retJobs != null) {
          retJobs.forEach(job => {
            job.runs = this.mockRuns;
          });

          this.jobs = retJobs;
        } else {
          console.log("User has no jobs");
        }
      });
  }

  getMockJobsByUser() {
    this.jobs = [
      {
        _id: "e5362300-bf75-11e9-909f-6f48786f343d",
        description: "Sold properties in UK cities",
        rawInputDirectory: "raw",
        stagingFileName: "staging",
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
        stagingFileName: "staging",
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
        stagingFileName: "staging",
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
        stagingFileName: "staging",
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
        stagingFileName: "staging",
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
        stagingFileName: "staging",
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
        stagingFileName: "staging",
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
        stagingFileName: "staging",
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
