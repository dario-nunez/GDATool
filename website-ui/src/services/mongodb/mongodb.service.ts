import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IUser } from 'src/models/user.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IJob } from 'src/models/job.model';
import { IAggregation } from 'src/models/aggregation.model';
import { IPlot } from 'src/models/plot.model';
import { ICluster } from 'src/models/cluster.model';

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

  createUser(email: string, password: string): Observable<IUser> {
    let user: IUser = {
      dashboards: [],
      name: email,
      email: email,
      password: password
    }

    console.log("User sent in the POST request: ");
    console.log(user);

    return this.http.post<IUser>("http://localhost:5000/ms/user", user).pipe(
      catchError(err => of(null))
    );
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>("http://localhost:5000/ms/user/getAll", {});
  }

  getUserByEmail(email: string): Observable<IUser> {
    return this.http.get<IUser>("http://localhost:5000/ms/user/byEmail/" + email);
  }

  deleteUser(id: string): Observable<IUser> {
    return this.http.delete<IUser>("http://localhost:5000/ms/user/" + id);
  }

  deleteUserRecursive(id: string): Observable<IUser> {
    return this.http.delete<IUser>("http://localhost:5000/ms/user/recursive/" + id);
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>("http://localhost:5000/ms/user/" + user._id, user).pipe(
      catchError(err => of(null))
    );
  }

  getJobsByUserId(userId: string): Observable<IJob[]> {
    return this.http.get<IUser>("http://localhost:5000/ms/job/byUser/" + userId).pipe(
      catchError(err => of(null))
    );
  }

  getJobById(jobId: string): Observable<IJob> {
    return this.http.get<IJob>("http://localhost:5000/ms/job/" + jobId).pipe(
      catchError(err => of(null))
    );
  }

  updateJob(job: IJob): Observable<IJob> {
    return this.http.put<IJob>("http://localhost:5000/ms/job/" + job._id, job).pipe(
      catchError(err => of(null))
    );
  }

  deleteJob(id: string): Observable<IJob> {
    return this.http.delete<IJob>("http://localhost:5000/ms/job/" + id);
  }

  deleteJobRecusrive(id: string): Observable<IJob> {
    return this.http.delete<IJob>("http://localhost:5000/ms/job/recursive/" + id);
  }

  createJob(job: IJob): Observable<IJob> {
    return this.http.post<IJob>("http://localhost:5000/ms/job", job).pipe(
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
    return this.http.post<IUser>("http://localhost:5000/ms/plot/multiple", plots).pipe(
      catchError(err => of(null))
    );
  }

  createMultipleClusters(clusters: ICluster[]): Observable<ICluster[]> {
    console.log("Clusters at mongo service");
    console.log(clusters);
    return this.http.post<IUser>("http://localhost:5000/ms/cluster/multiple", clusters).pipe(
      catchError(err => of(null))
    );
  }

  getUploadFileUrl(fileName: string, jobId: string): Observable<any> {
    const options: any = {
      responseType: "text"
    };
    return this.http.post<string>("http://localhost:5000/ms/job/getUploadFileUrl", { jobId, fileName }, options);
  }

  readFile(job: IJob): Observable<any> {
    const options: any = {
      responseType: "text"
    };
    return this.http.post<any>("http://localhost:5000/ms/job/readFile", job, options)
  }
}
