import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  constructor(private http: HttpClient) { }

  createUser(username: string, password: string){
    console.log("User being created: " + username + " p: " + password);
  }
}
