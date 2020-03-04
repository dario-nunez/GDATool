import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MongodbService } from '../mongodb/mongodb.service';
import { IUserModel } from '../../../../mongodb-service/src/models/userModel';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private mongodbService: MongodbService) { }

  authenticate(email: string, password: string): Observable<IUserModel> {
    const userAndPass = {
      email: email,
      password: password
    }

    return this.http.post<IUserModel>("http://localhost:5000/ms/user/authenticate", userAndPass).pipe(
      catchError(err => of(null))
    );
  }
}
