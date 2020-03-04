import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IUserModel } from '../../../../mongodb-service/src/models/userModel';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IJobModel } from '../../../../mongodb-service/src/models/jobModel';
import { IAggregationModel } from '../../../../mongodb-service/src/models/aggregationModel';
import { IPlotModel } from '../../../../mongodb-service/src/models/plotModel';
import { IClusterModel } from '../../../../mongodb-service/src/models/clusterModel';
import { IFilterModel } from '../../../../mongodb-service/src/models/filterModel';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {
  dashboardLink: string;

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string): Observable<IUserModel> {
    let user: IUserModel = {
      name: email,
      email: email,
      password: password
    }

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

  createMultipleAggregations(aggregations: IAggregationModel[]): Observable<IAggregationModel[]> {
    return this.http.post<IAggregationModel[]>("http://localhost:5000/ms/aggregation/multiple", aggregations).pipe(
      catchError(err => of(null))
    );
  }

  createMultiplePlots(plots: IPlotModel[]): Observable<IPlotModel[]> {
    return this.http.post<IPlotModel[]>("http://localhost:5000/ms/plot/multiple", plots).pipe(
      catchError(err => of(null))
    );
  }

  createMultipleClusters(clusters: IClusterModel[]): Observable<IClusterModel[]> {
    return this.http.post<IClusterModel[]>("http://localhost:5000/ms/cluster/multiple", clusters).pipe(
      catchError(err => of(null))
    );
  }

  createMultipleFilters(filters: IFilterModel[]): Observable<IFilterModel[]> {
    return this.http.post<IFilterModel>("http://localhost:5000/ms/filter/multiple", filters).pipe(
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
