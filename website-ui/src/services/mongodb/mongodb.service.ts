import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IUser } from 'src/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  constructor(private http: HttpClient) { }

  createUser(username: string, password: string):Observable<IUser> {    
    var user: IUser = {
      dashboards: [],
      name: username,
      username: username,
      email: username,
      password: password
    }

    console.log("User sent in the POST request: " + user);

    return this.http.post("http://localhost:5000/ms/user", user) as Observable<IUser>;
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>("http://localhost:5000/ms/user/getAll", {});
  }

  getUserByUsername(username: string): Observable<IUser> {
    return this.http.get<IUser>("http://localhost:5000/ms/user/byUsername/" + username);
  }
}
