import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IUser } from 'src/models/user.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  constructor(private http: HttpClient) { }

  createUser(username: string, password: string): Observable<IUser> {
    var user: IUser = {
      dashboards: [],
      name: username,
      username: username,
      email: username,
      password: password
    }

    console.log("User sent in the POST request: " + user);

    return this.http.post<IUser>("http://localhost:5000/ms/user", user).pipe(
      catchError(err => of(null))
    );
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>("http://localhost:5000/ms/user/getAll", {});
  }

  getUserByUsername(username: string): Observable<IUser> {
    return this.http.get<IUser>("http://localhost:5000/ms/user/byUsername/" + username);
  }

  deleteUser(id: string):Observable<IUser> {
    return this.http.delete<IUser>("http://localhost:5000/ms/user/" + id);
  }

  updateUser(user: IUser):Observable<IUser> {
    return this.http.put<IUser>("http://localhost:5000/ms/user/" + user._id, user).pipe(
      catchError(err => of(null))
    );
  }
}
