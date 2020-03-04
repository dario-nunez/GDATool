import { Component, OnInit } from '@angular/core';
import { SchemaService } from 'src/services/schema/schema.service';
import { QueryService } from 'src/services/query/query.service';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { IJobModel } from '../../../../../../mongodb-service/src/models/jobModel';
import { IPlotModel } from '../../../../../../mongodb-service/src/models/plotModel';

@Component({
  selector: 'app-general-plots',
  templateUrl: './general-plots.component.html',
  styleUrls: ['./general-plots.component.css']
})
export class GeneralPlotsComponent implements OnInit {
  job: IJobModel;
  typeList: Array<[string, string]> = [];
  COLUMNS: Array<string> = [];
  featureColumns: Array<string> = [];
  xAvailableColumns: Array<string> = [];
  yAvailableColumns: Array<string> = [];
  chosenXColumn: string;
  chosenYColumn: string;
  chosenIdentifierColumn: string;

  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private schemaService: SchemaService, public queryService: QueryService) { }

  ngOnInit() {
    this.queryService.generalPlots = [];

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
      this.typeList.push(element);
      this.featureColumns.push(element[0]);
      if (!this.COLUMNS.includes(element[0])) {
        this.COLUMNS.push(element[0]);
      }
    });

    // Load metric columns
    this.schemaService.metricColumns.forEach(element => {
      this.typeList.push(element);
      if (!this.COLUMNS.includes(element[0])) {
        this.COLUMNS.push(element[0]);
      }
    });

    this.xAvailableColumns = this.xAvailableColumns.concat(this.COLUMNS)
    this.yAvailableColumns = this.yAvailableColumns.concat(this.COLUMNS);
  }

  selectXColumn(event, column) {
    this.yAvailableColumns = this.COLUMNS.filter(obj => obj !== column)
  }

  selectYColumn(event, column) {
    this.xAvailableColumns = this.COLUMNS.filter(obj => obj !== column)
  }

  createPlot() {
    const newPlot: IPlotModel = {
      jobId: this.job._id,
      identifier: this.chosenIdentifierColumn,
      identifierType: this.getVegaColumnType(this.chosenIdentifierColumn),
      xAxis: this.chosenXColumn,
      xType: this.getVegaColumnType(this.chosenXColumn),
      yAxis: this.chosenYColumn,
      yType: this.getVegaColumnType(this.chosenYColumn),
    }

    this.yAvailableColumns = this.COLUMNS;
    this.xAvailableColumns = this.COLUMNS;
    this.chosenXColumn = "";
    this.chosenYColumn = "";
    this.chosenIdentifierColumn = "";

    this.queryService.generalPlots.push(newPlot);
  }

  private getVegaColumnType(columnName) {
    let type = this.typeList.filter(obj => obj[0] == columnName)[0][1];

    if (type == "integer" || type == "double") {
      return "quantitative"
    } else {
      return "nominal"
    }
  }

  deletePlot(event, plot) {
    this.queryService.generalPlots = this.queryService.generalPlots.filter(obj => obj !== plot);
  }
} 
