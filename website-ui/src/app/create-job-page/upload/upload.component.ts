import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IJob } from 'src/models/job.model';
import { FileUploader } from "ng2-file-upload";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  jobId: string;
  job: IJob;
  ioDisabled: boolean = true;
  uploader: FileUploader;

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private router: Router) {
    this.jobId = this.route.snapshot.paramMap.get("job._id");
    console.log(this.jobId)
    this.job = {} as IJob;
    this.uploader = new FileUploader({
      method: "PUT",
      disableMultipart: true // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    });

    this.uploader.onCompleteItem = (item => {
      console.log("File just uploaded:")
      console.log(item.file.name)
      this.job.rawInputDirectory = this.job.rawInputDirectory + "/" + item.file.name;
      this.ioDisabled = false;
    });

    this.uploader.onAfterAddingFile = (item => {
      if (this.uploader.queue.length > 0) {
        this.uploader.queue = [item];
      }
      this.mongodbService.getUploadFileUrl(item.file.name, this.jobId).subscribe(value => {
        item.url = value;
        console.log("File has been added")
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
      this.router.navigate(['/schema', this.jobId]);
    });
  }
}