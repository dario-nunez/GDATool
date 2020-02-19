import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IJob } from 'src/models/job.model';
import { SchemaService } from 'src/services/schema/schema.service';
import { QueryService } from 'src/services/query/query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})

export class QueryComponent implements OnInit {
  ioDisabled: boolean = true;
  metricSelected: boolean = false;
  jobId: string;
  job: IJob;
  paramJob: IJob[] = [];

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private schemaService: SchemaService, private queryService: QueryService, private router: Router) { }

  ngOnInit() {
    // Should probably reset the query service every time this page is reached or inside the components

    // Load job information and generate default aggregations
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.mongodbService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
        job.jobStatus = 4;
        this.ioDisabled = false;
        this.paramJob.push(job);
      });
    });
  }

  next() {
    console.log("Query service before submitting:");
    console.log(this.queryService);
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      this.mongodbService.createMultipleAggregations(this.queryService.aggregations).subscribe(aggs => {
        this.mongodbService.createMultiplePlots(this.queryService.generalPlots).subscribe(plots => {
          console.log("Job updated, aggregations added, plots added");
          this.router.navigate(['/execute', this.jobId]);
        });
      });
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
