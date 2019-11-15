import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/models/user.model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: IUser;

  constructor() { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.user = {
      _id: "111111111111111111111111",
      dashboards: [],
      name: "Rose",
      username: "Roseusername",
      email: "Rose@email",
      password: "Rosepassword"
    }
  }
}
