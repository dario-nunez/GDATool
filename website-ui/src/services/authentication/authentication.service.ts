import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IUser } from 'src/models/user.model';
import { Observable } from 'rxjs';
import { MongodbService } from '../mongodb/mongodb.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private mongodbService: MongodbService) { }

  /**
   * Return the userId of a user if the username and password match
   * @param username 
   * @param password 
   */
  authenticate(username: string, password: string): Observable<boolean> {
    console.log("At auth: -- Username: " + username + " Password: " + password);

    const userAndPass = {
      username: username,
      password: password
    }

    return this.http.post("http://localhost:5000/ms/user/authenticate", userAndPass) as Observable<boolean>;
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>("http://localhost:5000/ms/user/getAll", {});
  }
}
