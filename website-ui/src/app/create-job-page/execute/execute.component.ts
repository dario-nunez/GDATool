import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IJob } from 'src/models/job.model';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.css']
})
export class ExecuteComponent implements OnInit {
  analysisJobExecuted = false;
  job: IJob;
  jobId: string;
  ioDisabled: boolean = true;

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.job = {
      _id: "",
      name: "",
      description: "",
      rawInputDirectory: "",
      stagingFileName: "",
      userId: "",
      generateESIndices: true,
      jobStatus: 0,
      runs: []
    }

    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.mongodbService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
        if (this.job.jobStatus >= 5) {
            this.analysisJobExecuted = true;
        }
        this.ioDisabled = false;
      });
    });
  }

  submitAndRun() {
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      console.log("Trigger Spark job")
      this.router.navigate(['/jobsPage']);
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
