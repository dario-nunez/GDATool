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
   * Return the userId of a user if the email and password match
   * @param email 
   * @param password 
   */
  authenticate(email: string, password: string): Observable<any> {
    console.log("At auth: -- Email: " + email + " Password: " + password);

    const userAndPass = {
      email: email,
      password: password
    }

    return this.http.post("http://localhost:5000/ms/user/authenticate", userAndPass) as Observable<any>;
  }
}
