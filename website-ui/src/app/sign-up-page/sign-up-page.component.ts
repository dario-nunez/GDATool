import { Component, OnInit } from '@angular/core';
import { IUser } from "src/models/user.model";

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {

  public user: IUser;
  public repeatedPassword: string;
  constructor() { }

  ngOnInit() {
    this.user = {
      email: "",
      username: "",
      password: ""
    } as IUser;
  }

  createUser() {
    console.log("Create user button clicked");
  }
}
