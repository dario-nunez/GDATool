import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IUser } from 'src/models/user.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IJob } from 'src/models/job.model';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string): Observable<IUser> {
    var user: IUser = {
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

  deleteUser(id: string):Observable<IUser> {
    return this.http.delete<IUser>("http://localhost:5000/ms/user/" + id);
  }

  updateUser(user: IUser):Observable<IUser> {
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

  updateJob(job: IJob):Observable<IJob> {
    return this.http.put<IJob>("http://localhost:5000/ms/job/" + job._id, job).pipe(
      catchError(err => of(null))
    );
  }

  deleteJob(id: string):Observable<IJob> {
    return this.http.delete<IJob>("http://localhost:5000/ms/job/" + id);
  }

  createJob(job: IJob): Observable<IJob> {
    console.log("Job sent in the POST request: ");
    console.log(job);

    return this.http.post<IJob>("http://localhost:5000/ms/job", job).pipe(
      catchError(err => of(null))
    );
  }
}
