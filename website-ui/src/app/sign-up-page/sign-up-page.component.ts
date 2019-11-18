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
  private repeatedPassword: string;
  private emailExists: boolean;

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit() {
    this.user = {
      email: "",
      username: "",
      password: ""
    } as IUser;

    this.repeatedPassword = "";
    this.emailExists = false;
  }

  emailValueChange() {
    this.emailExists = false;
  }

  createUser() {
    this.mongodbService.createUser(this.user.email, this.user.password).subscribe(
      user => {
        if (user != null) {
          console.log("Returned created user: " + user);
          const simplifiedUser = {
            id: user._id,
            username: user.email
          };
          localStorage.setItem("user", JSON.stringify(simplifiedUser));
          this.router.navigate(['/jobsPage']);
        } else {
          this.user.password = "";
          this.repeatedPassword = "";
          this.emailExists = true;
        }
      }
    );
  }
}
