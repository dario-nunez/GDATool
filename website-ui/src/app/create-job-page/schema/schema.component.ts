import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemaService } from 'src/services/schema/schema.service';
import { IJob } from 'src/models/job.model';
import { ISchema } from 'src/models/schema.model';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent implements OnInit {
  ioDisabled: boolean = true;
  job: IJob;
  jobId: string;
  schemaFilePresent = false;
  COLUMNS: Array<[string, string]> = [];
  SELECTED_METRICS: Array<[string, string]> = [];
  SELECTED_FEATURES: Array<[string, string]> = [];
  schema: ISchema;

  constructor(private mongodbService: MongodbService, private schemaService: SchemaService, private route: ActivatedRoute, private router: Router) { }

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
        job.jobStatus = 3;
        this.ioDisabled = false;
        this.mongodbService.readFile(job).subscribe(fileContents => {
          if (fileContents.toString().length == 0) {
            console.log("The schema file is empty!");
          } else {
            this.schemaFilePresent = true;
            this.schema = JSON.parse(fileContents);
            this.schema.schema.forEach(column => {
              this.COLUMNS.push([column.name, column.type])
            });
          }
        })
      });
    });
  }

  moveColumn(event, element: [string, string], originArray: Array<[string, string]>, destinationArray: Array<[string, string]>) {
    console.log("from " + originArray + " to " + destinationArray)

    if (originArray == this.COLUMNS) {
      this.COLUMNS = this.COLUMNS.filter(obj => obj[0] !== element[0]);
    } else if (originArray == this.SELECTED_FEATURES) {
      this.SELECTED_FEATURES = this.SELECTED_FEATURES.filter(obj => obj[0] !== element[0]);
    } else {
      this.SELECTED_METRICS = this.SELECTED_METRICS.filter(obj => obj[0] !== element[0]);
    }

    if (destinationArray == this.COLUMNS) {
      this.COLUMNS.push(element)
    } else if (destinationArray == this.SELECTED_FEATURES) {
      this.SELECTED_FEATURES.push(element)
    } else {
      this.SELECTED_METRICS.push(element)
    }
  }

  next() {
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      this.schemaService.setFeatureColumns(this.SELECTED_FEATURES);
      this.schemaService.setMetricColumns(this.SELECTED_METRICS);
      this.router.navigate(['/query', this.jobId]);
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
