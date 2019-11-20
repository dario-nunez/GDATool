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
  private emailExists: boolean;
  private repeatedPassword: string;

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit() {
    // Initialise the user before the page is displayed to avoid an error while the data arrives
    this.user = {
      _id: "",
      dashboards: [],
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
          id: this.user._id,
          email: this.user.email
        };

        console.log("Simplified user: ");
        console.log(simplifiedUser);

        localStorage.setItem("user", JSON.stringify(simplifiedUser));
        this.router.navigate(['/jobsPage']);
      } else {
        console.log("Email already exists");
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
      this.mongodbService.deleteUser(JSON.parse(localStorage.getItem("user")).id).subscribe(user => {
        console.log("Deleted User: ");
        console.log(user);
        localStorage.clear();
        this.router.navigate(['/']);
      });
    }
  }
}
