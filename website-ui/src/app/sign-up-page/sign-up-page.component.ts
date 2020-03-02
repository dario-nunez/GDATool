import { Component, OnInit } from '@angular/core';
import { IUserModel } from '../../../../mongodb-service/src/models/userModel';
import { Router } from '@angular/router';
import { MongodbService } from '../../services/mongodb/mongodb.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {

  private user: IUserModel;
  repeatedPassword: string;
  emailExists: boolean;

  constructor(private router: Router, public mongodbService: MongodbService) { }

  ngOnInit() {
    this.user = {
      name: "",
      email: "",
      password: ""
    }

    this.repeatedPassword = "";
    this.emailExists = false;
  }

  emailValueChange() {
    this.emailExists = false;
  }

  createUser() {
    this.mongodbService.createUser(this.user.email, this.user.password).subscribe(user => {
        if (user != null) {
          const simplifiedUser = {
            id: user._id,
            email: user.email
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
