import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemaService } from 'src/services/schema/schema.service';
import { QueryService } from 'src/services/query/query.service';
import { IJobModel } from '../../../../../mongodb-service/src/models/jobModel';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})

export class QueryComponent implements OnInit {
  ioDisabled: boolean = true;
  metricSelected: boolean = false;
  jobId: string;
  job: IJobModel;
  paramJob: IJobModel[] = [];

  constructor(public mongodbService: MongodbService, private route: ActivatedRoute, private schemaService: SchemaService, public queryService: QueryService, private router: Router) { }

  ngOnInit() {
    // Should probably reset the query service every time this page is reached or inside the components
    // Load job information and generate default aggregations
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      if (this.schemaService.schema == undefined) {
        this.router.navigate(['/schema', this.jobId]);
      } else {
        this.mongodbService.getJobById(this.jobId).subscribe(job => {
          this.job = job;
          job.jobStatus = 4;
          this.ioDisabled = false;
          this.paramJob.push(job);
        });
      }
    });
  }

  next() {
    this.mongodbService.updateJob(this.job).subscribe(retJob => {
      this.mongodbService.createMultipleAggregations(this.queryService.aggregations).subscribe(aggs => {
        // Add aggregation IDs before moving on to the clusters
        aggs.forEach(agg => {
          this.queryService.aggregations.find(obj => obj.name === agg.name)._id = agg._id
        });
        this.mongodbService.createMultiplePlots(this.queryService.generalPlots).subscribe(plots => {
          // Update aggregation IDs in clusters
          this.queryService.aggregationClusters.map(obj => obj.aggId = this.getAggId(obj.aggName));
          this.mongodbService.createMultipleClusters(this.queryService.aggregationClusters).subscribe(clusters => {
            // Update aggregation IDs in filters
            this.queryService.aggregationFilters.map(obj => obj.aggId = this.getAggId(obj.aggName));
            this.mongodbService.createMultipleFilters(this.queryService.aggregationFilters).subscribe(filters => {
              this.router.navigate(['/execute', this.jobId]);
            });
          });
        });
      });
    });
  }

  getAggId(aggName: string) {
    let aggId = this.queryService.aggregations.filter(obj => obj.name == aggName)[0]._id
    return aggId;
  }

  deleteJob() {
    if (confirm("This job will be lost forever. Are you sure you want to delete it?")) {
      this.mongodbService.deleteJobRecusrive(this.job._id).subscribe(job => {
        this.router.navigate(['/jobsPage']);
      });
    }
  }
}
