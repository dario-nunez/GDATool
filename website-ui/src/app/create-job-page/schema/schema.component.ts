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
  // COLUMNS: Array<[string, string]> = [["city", "string"], ["county", "string"], ["id", "string"], ["price", "integer"], ["kindaLongNameLong", "string"]];
  COLUMNS: Array<[string, string]> = [];
  SELECTED_METRICS: Array<[string, string]> = [];
  SELECTED_FEATURES: Array<[string, string]> = [];
  schema: ISchema;

  constructor(private mongodbService: MongodbService, private schemaService: SchemaService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.mongodbService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
        job.jobStatus = 3;
        this.ioDisabled = false;
        this.mongodbService.readFile(job).subscribe(fileContents => {
          this.schema = JSON.parse(fileContents);
          this.schema.schema.forEach(column => {
            this.COLUMNS.push([column.name, column.type])
          });
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
}
