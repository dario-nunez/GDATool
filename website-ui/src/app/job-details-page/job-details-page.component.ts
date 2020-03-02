import { Component, OnInit, Input } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute, Router } from '@angular/router'
import { IJobModel } from '../../../../mongodb-service/src/models/jobModel';

@Component({
  selector: 'app-job-details-page',
  templateUrl: './job-details-page.component.html',
  styleUrls: ['./job-details-page.component.css']
})
export class JobDetailsPageComponent implements OnInit {

  job: IJobModel;
  public jobId: string;

  constructor(public mongodbService: MongodbService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.job = {
      name: "",
      description: "",
      rawInputDirectory: "",
      stagingFileName: "",
      userId: "",
      generateESIndices: true,
      jobStatus: 0
    }

    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.getJob();
    });
  }

  getJob() {
    this.mongodbService.getJobById(this.jobId).subscribe(job => {
      this.job = job;
    });
  }

  updateJob() {
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
        this.router.navigate(['/jobsPage']);
      });
    }
  }
}
