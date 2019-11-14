import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/models/user.model';
import { Router } from '@angular/router';
import { MongodbService } from '../../services/mongodb/mongodb.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {

  private user: IUser;

  private userEmail: string;
  private userPassword: string;
  private repeatedPassword: string;

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit() {
    this.user = {
      email: "",
      username: "",
      password: ""
    } as IUser;
  }

  createUser() {
    console.log("Create user button clicked");
    this.mongodbService.createUser(this.user.username, this.user.password);
    //this.router.navigate(['/jobsPage']);
  }
}
