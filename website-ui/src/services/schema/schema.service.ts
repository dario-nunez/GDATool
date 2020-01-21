import { Injectable } from '@angular/core';
import { IJob } from 'src/models/job.model';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  featureColumns: Array<string> = [];
  metricColumns: Array<string> = [];
  job: IJob;

  constructor() { 
    this.job = {
      name: "",
      description: "",
      rawInputDirectory: "",
      stagingFileName: "",
      userId: "",
      generateESIndices: true,
      jobStatus: "",
      runs: []
    }
  }

  getFeatureColumns() {
    return this.featureColumns;
  }

  getMetricColumns() {
    return this.metricColumns;
  }

  setFeatureColumns(newFeatureColumns: Array<string>) {
    this.featureColumns = newFeatureColumns;
  }

  setMetricColumns(newMetricColumns: Array<string>) {
    this.metricColumns = newMetricColumns;
  }

  getJob() {
    console.log(this.job)
    return this.job;
  }

  updateJob(newJob: IJob): IJob {
    if (newJob._id != "") {
      this.job._id = newJob._id;
    }

    if (newJob.name != "") {
      this.job.name = newJob.name;
    }

    if (newJob.description != "") {
      this.job.description = newJob.description
    }

    if (newJob.rawInputDirectory != "") {
      this.job.rawInputDirectory = newJob.rawInputDirectory
    }

    if (newJob.stagingFileName != "") {
      this.job.stagingFileName = newJob.stagingFileName
    }

    if (newJob.userId != "") {
      this.job.userId = newJob.userId
    }

    if (newJob.jobStatus != "") {
      this.job.jobStatus = newJob.jobStatus
    }

    return this.job;
  }
}
