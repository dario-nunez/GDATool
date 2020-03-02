import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from "ng2-file-upload";
import { IJobModel } from '../../../../../mongodb-service/src/models/jobModel';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  jobId: string;
  job: IJobModel;
  ioDisabled: boolean = true;
  uploader: FileUploader;
  itemSize: number;

  constructor(public mongodbService: MongodbService, private route: ActivatedRoute, private router: Router) {
    this.jobId = this.route.snapshot.paramMap.get("job._id");
    this.job = {} as IJobModel;
    this.uploader = new FileUploader({
      method: "PUT",
      disableMultipart: true // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    });

    this.uploader.onCompleteItem = (item => {
      this.job.rawInputDirectory = this.job.rawInputDirectory + "/" + item.file.name;
      this.ioDisabled = false;
    });

    this.uploader.onAfterAddingFile = (item => {
      this.itemSize = item._file.size;
      if (this.uploader.queue.length > 0) {
        this.uploader.queue = [item];
      }
      this.mongodbService.getUploadFileUrl(item.file.name, this.jobId).subscribe(value => {
        item.url = value;
      },
        error => console.log(error)
      );
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.mongodbService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
        job.jobStatus = 2;
      });
    });
  }

  next() {
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      this.router.navigate(['/schema', retJob._id]);
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