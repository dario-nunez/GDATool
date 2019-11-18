import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/models/user.model';
import { MongodbService } from "../../services/mongodb/mongodb.service";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: IUser;

  constructor(private mongodbService: MongodbService) { }

  ngOnInit() {
    // Initialise the user before the page is displayed to avoid an error while the data arrives
    this.user = {
      _id: "",
      dashboards: [],
      name: "",
      username: "",
      email: "",
      password: ""
    }

    this.mongodbService.getUserByUsername(JSON.parse(localStorage.getItem("user")).username).subscribe(user => {
      this.user = user
    });
  }
}
