import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/models/user.model';
import { MongodbService } from "../../services/mongodb/mongodb.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: IUser;

  constructor(private router: Router, private mongodbService: MongodbService) { }

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

  updateAccount() {
    
  }

  deleteAccount() {
    if (confirm("This account will be lost forever. Are you sure you want to delete it?" + name)) {
      this.mongodbService.deleteUser(JSON.parse(localStorage.getItem("user")).id).subscribe(user => {
        console.log("Deleted User: ");
        console.log(user);
        localStorage.clear();
        this.router.navigate(['/']);
      });
    }
  }
}
