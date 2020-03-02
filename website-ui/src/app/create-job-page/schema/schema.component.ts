import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemaService } from 'src/services/schema/schema.service';
import { ISchema } from 'src/models/schema.model';
import { IJobModel } from '../../../../../mongodb-service/src/models/jobModel';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent implements OnInit {
  ioDisabled: boolean = true;
  job: IJobModel;
  jobId: string;
  schemaFilePresent = false;
  COLUMNS: Array<[string, string]> = [];
  SELECTED_METRICS: Array<[string, string]> = [];
  SELECTED_FEATURES: Array<[string, string]> = [];

  // This variable holds the whole schema file
  schema: ISchema;

  constructor(public mongodbService: MongodbService, private schemaService: SchemaService, private route: ActivatedRoute, private router: Router) { }

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
    if (originArray == this.COLUMNS) {                   // From COLUMNS column
      if (element[1] == "double") {  // Numeric
        if (destinationArray == this.SELECTED_FEATURES) {
          if (this.SELECTED_METRICS.includes(element)) {
            this.COLUMNS = this.COLUMNS.filter(obj => obj[0] !== element[0]);
          }
        } else {
          if (this.SELECTED_FEATURES.includes(element)) {
            this.COLUMNS = this.COLUMNS.filter(obj => obj[0] !== element[0]);
          }
        }
      } else {  // Non numeric
        this.COLUMNS = this.COLUMNS.filter(obj => obj[0] !== element[0]);
      }
    } else if (originArray == this.SELECTED_FEATURES) { // From FEATURES column
      this.SELECTED_FEATURES = this.SELECTED_FEATURES.filter(obj => obj[0] !== element[0]);
    } else {                                            // From METRICS column
      this.SELECTED_METRICS = this.SELECTED_METRICS.filter(obj => obj[0] !== element[0]);
    }

    if (destinationArray == this.COLUMNS) {
      if (element[1] == "double") {  // Numeric
        if (!destinationArray.includes(element)) {
          this.COLUMNS.push(element)
        }
      } else {  // Non numeric
        this.COLUMNS.push(element)
      }
    } else if (destinationArray == this.SELECTED_FEATURES && !this.SELECTED_FEATURES.includes(element)) {
      this.SELECTED_FEATURES.push(element)
    } else if (destinationArray == this.SELECTED_METRICS && !this.SELECTED_METRICS.includes(element)) {
      this.SELECTED_METRICS.push(element)
    }
  }

  next() {
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      this.schemaService.setFeatureColumns(this.SELECTED_FEATURES);
      this.schemaService.setMetricColumns(this.SELECTED_METRICS);
      this.schemaService.schema = this.schema;
      this.router.navigate(['/query', retJob._id]);
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
