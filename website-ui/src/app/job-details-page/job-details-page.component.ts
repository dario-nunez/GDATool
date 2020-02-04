import { Component, OnInit, Input } from '@angular/core';
import { IJob } from 'src/models/job.model';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-job-details-page',
  templateUrl: './job-details-page.component.html',
  styleUrls: ['./job-details-page.component.css']
})
export class JobDetailsPageComponent implements OnInit {

  job: IJob;
  public jobId: string;

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
      this.getJob();
    });
  }

  getJob() {
    this.mongodbService.getJobById(this.jobId).subscribe(job => {
      console.log("Returned job");
      console.log(job);
      this.job = job;
    });
  }

  updateJob() {
    console.log("sent job: ");
    console.log(this.job);
    this.mongodbService.updateJob(this.job).subscribe(job => {
      if (job != null) {
        this.router.navigate(['/jobsPage']);
      } else {
        console.log("Error happenened while updating job");
      }
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
