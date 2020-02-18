import { Component, OnInit, Input } from '@angular/core';
import { SchemaService } from 'src/services/schema/schema.service';
import { IJob } from 'src/models/job.model';
import { IPlot } from 'src/models/plot.model';
import { QueryService } from 'src/services/query/query.service';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-general-plots',
  templateUrl: './general-plots.component.html',
  styleUrls: ['./general-plots.component.css']
})
export class GeneralPlotsComponent implements OnInit {
  public job: IJob;

  COLUMNS: Array<string> = [];
  featureColumns: Array<string> = [];
  xAvailableColumns: Array<string> = [];
  yAvailableColumns: Array<string> = [];
  chosenXColumn: string;
  chosenYColumn: string;
  chosenIdentifierColumn: string;

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private schemaService: SchemaService, private queryService: QueryService, private router: Router) { }

  ngOnInit() {
    this.queryService.generalPlots = [];
    console.log("Job in general-plots: ");

    this.chosenXColumn = "";
    this.chosenYColumn = "";
    this.chosenIdentifierColumn = "";

    // Load job information and generate default aggregations
    this.route.params.subscribe(params => {
      let jobId = params["job._id"];
      this.mongodbService.getJobById(jobId).subscribe(job => {
        this.job = job;
      });
    });

    // Load feature columns
    this.schemaService.featureColumns.forEach(element => {
      this.featureColumns.push(element[0]);
      this.COLUMNS.push(element[0]);
      this.xAvailableColumns.push(element[0]);
      this.yAvailableColumns.push(element[0]);
    });

    // Load metric columns
    this.schemaService.metricColumns.forEach(element => {
      this.COLUMNS.push(element[0]);
      this.xAvailableColumns.push(element[0]);
      this.yAvailableColumns.push(element[0]);
    });
  }

  selectXColumn(event, column) {
    this.yAvailableColumns = this.COLUMNS.filter(obj => obj !== column)
  }

  selectYColumn(event, column) {
    this.xAvailableColumns = this.COLUMNS.filter(obj => obj !== column)
  }

  createPlot() {
    const newPlot: IPlot = {
      jobId: this.job._id,
      identifier: this.chosenIdentifierColumn,
      xAxis: this.chosenXColumn,
      yAxis: this.chosenYColumn
    }

    this.yAvailableColumns = this.COLUMNS;
    this.xAvailableColumns = this.COLUMNS;
    this.chosenXColumn = "";
    this.chosenYColumn = "";
    this.chosenIdentifierColumn = "";

    this.queryService.generalPlots.push(newPlot);

    console.log("Query Service object")
    console.log(this.queryService)
  }

  deletePlot(event, plot) {
    console.log(plot)
    this.queryService.generalPlots = this.queryService.generalPlots.filter(obj => obj !== plot);
  }
} 
