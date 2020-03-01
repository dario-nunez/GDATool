import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IUserModel } from '../../../../mongodb-service/src/models/userModel';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IJobModel } from '../../../../mongodb-service/src/models/jobModel';
import { IAggregation } from 'src/models/aggregation.model';
import { IPlot } from 'src/models/plot.model';
import { ICluster } from 'src/models/cluster.model';
import { IFilter } from 'src/models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  private upsertUserUrl = "ms/user";
  private createAndGetJWT = "ms/user/createAndGetJWT";

  dashboardLink: string;
  private corsHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    Accept: "application/json"
  });

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string): Observable<IUserModel> {
    let user: IUserModel = {
      name: email,
      email: email,
      password: password
    }

    console.log("User sent in the POST request: ");
    console.log(user);

    return this.http.post<IUserModel>("http://localhost:5000/ms/user", user).pipe(
      catchError(err => of(null))
    );
  }

  getAllUsers(): Observable<IUserModel[]> {
    return this.http.get<IUserModel[]>("http://localhost:5000/ms/user/getAll", {});
  }

  getUserByEmail(email: string): Observable<IUserModel> {
    return this.http.get<IUserModel>("http://localhost:5000/ms/user/byEmail/" + email);
  }

  deleteUser(id: string): Observable<IUserModel> {
    return this.http.delete<IUserModel>("http://localhost:5000/ms/user/" + id);
  }

  deleteUserRecursive(id: string): Observable<IUserModel> {
    return this.http.delete<IUserModel>("http://localhost:5000/ms/user/recursive/" + id);
  }

  updateUser(user: IUserModel): Observable<IUserModel> {
    return this.http.put<IUserModel>("http://localhost:5000/ms/user/" + user._id, user).pipe(
      catchError(err => of(null))
    );
  }

  getJobsByUserId(userId: string): Observable<IJobModel[]> {
    return this.http.get<IJobModel>("http://localhost:5000/ms/job/byUser/" + userId).pipe(
      catchError(err => of(null))
    );
  }

  getJobById(jobId: string): Observable<IJobModel> {
    return this.http.get<IJobModel>("http://localhost:5000/ms/job/" + jobId).pipe(
      catchError(err => of(null))
    );
  }

  updateJob(job: IJobModel): Observable<IJobModel> {
    return this.http.put<IJobModel>("http://localhost:5000/ms/job/" + job._id, job).pipe(
      catchError(err => of(null))
    );
  }

  deleteJob(id: string): Observable<IJobModel> {
    return this.http.delete<IJobModel>("http://localhost:5000/ms/job/" + id);
  }

  deleteJobRecusrive(id: string): Observable<IJobModel> {
    return this.http.delete<IJobModel>("http://localhost:5000/ms/job/recursive/" + id);
  }

  createJob(job: IJobModel): Observable<IJobModel> {
    return this.http.post<IJobModel>("http://localhost:5000/ms/job", job).pipe(
      catchError(err => of(null))
    );
  }

  createMultipleAggregations(aggregations: IAggregation[]): Observable<IAggregation[]> {
    return this.http.post<IAggregation[]>("http://localhost:5000/ms/aggregation/multiple", aggregations).pipe(
      catchError(err => of(null))
    );
  }

  createMultiplePlots(plots: IPlot[]): Observable<IPlot[]> {
    console.log("Plots at mongo service");
    console.log(plots);
    return this.http.post<IPlot[]>("http://localhost:5000/ms/plot/multiple", plots).pipe(
      catchError(err => of(null))
    );
  }

  createMultipleClusters(clusters: ICluster[]): Observable<ICluster[]> {
    console.log("Clusters at mongo service");
    console.log(clusters);
    return this.http.post<ICluster[]>("http://localhost:5000/ms/cluster/multiple", clusters).pipe(
      catchError(err => of(null))
    );
  }

  createMultipleFilters(filters: IFilter[]): Observable<IFilter[]> {
    console.log("Filters at mongo service");
    console.log(filters);
    return this.http.post<IFilter>("http://localhost:5000/ms/filter/multiple", filters).pipe(
      catchError(err => of(null))
    );
  }

  getUploadFileUrl(fileName: string, jobId: string): Observable<any> {
    const options: any = {
      responseType: "text"
    };
    return this.http.post<string>("http://localhost:5000/ms/job/getUploadFileUrl", { jobId, fileName }, options);
  }

  readFile(job: IJobModel): Observable<any> {
    const options: any = {
      responseType: "text"
    };
    return this.http.post<any>("http://localhost:5000/ms/job/readFile", job, options)
  }
}
