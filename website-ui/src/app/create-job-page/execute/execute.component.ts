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
  job: IJob;
  jobId: string;
  ioDisabled: boolean = true;

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.mongodbService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
        job.jobStatus = 5;
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
}
