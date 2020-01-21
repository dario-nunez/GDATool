import { Component, OnInit } from '@angular/core';
import { IJob } from 'src/models/job.model';
import { IAggregation } from 'src/models/aggregation.model';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';
import { SchemaService } from 'src/services/schema/schema.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  job: IJob;
  aggregations: IAggregation[];
  customAggregations: boolean;
  currentAggregationName: string;
  currentAggregationMetricColumn: string;

  constructor(private mongodbService: MongodbService, private schemaService: SchemaService, private router: Router) { }

  ngOnInit() {
    this.job = {
      name: "",
      description: "",
      rawInputDirectory: "",
      stagingFileName: "",
      userId: JSON.parse(localStorage.getItem("user")).id,
      generateESIndices: true,
      jobStatus: 1,
      runs: []
    }
  }

  createJob() {
    this.mongodbService.createJob(this.job).subscribe(retJob => {
      this.router.navigate(['/upload', retJob._id]);
    });
  }
}
