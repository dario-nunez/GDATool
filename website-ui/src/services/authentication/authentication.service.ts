import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IUser } from 'src/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  /**
   * Return the userId of a user if the username and password match
   * @param username 
   * @param password 
   */
  login(username: string, password: string) : boolean {
    console.log("At auth: -- Username: " + username + " Password: " + password);
    
    if (username == "Rose@email" && password == "Rosepassword") {
      localStorage.setItem("username", username);
      return true;
    }

    return false;
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>("http://localhost:5000/ms/user/getAll", {});
  }

  authenticateUser(): Observable<IUser[]> {
    //Implement endpoint in mongodb-service, then implement this method
    return;
  }
}
