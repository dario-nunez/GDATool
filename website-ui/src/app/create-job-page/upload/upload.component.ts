import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IJob } from 'src/models/job.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  jobId: string;
  ioDisabled: boolean = true;

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.ioDisabled = false;
    });
  }

  next() {
    this.router.navigate(['/schema', this.jobId]);
  }
}
