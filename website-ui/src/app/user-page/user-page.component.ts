import { Component, OnInit } from '@angular/core';
import { MongodbService } from "../../services/mongodb/mongodb.service";
import { Router } from '@angular/router';
import { IUserModel } from '../../../../mongodb-service/src/models/userModel';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: IUserModel;
  private emailExists: boolean;
  private repeatedPassword: string;

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit() {
    // Initialise the user before the page is displayed to avoid an error while the data arrives
    this.user = {
      name: "",
      email: "",
      password: ""
    }

    this.mongodbService.getUserByEmail(JSON.parse(localStorage.getItem("user")).email).subscribe(user => {
      this.user = user
    });
  }

  updateAccount() {
    this.user.email = this.user.email;

    this.mongodbService.updateUser(this.user).subscribe(user => {
      if (user != null) {
        const simplifiedUser = {
          _id: this.user._id,
          email: this.user.email
        };

        localStorage.setItem("user", JSON.stringify(simplifiedUser));
        this.router.navigate(['/jobsPage']);
      } else {
        this.user.password = "";
        this.repeatedPassword = "";
        this.emailExists = true;
      }
    });
  }

  emailValueChange() {
    this.emailExists = false;
  }

  deleteAccount() {
    if (confirm("This account will be lost forever. Are you sure you want to delete it?")) {
      this.mongodbService.deleteUserRecursive(JSON.parse(localStorage.getItem("user"))._id).subscribe(user => {
        localStorage.clear();
        this.router.navigate(['/']);
      });
    }
  }
}
