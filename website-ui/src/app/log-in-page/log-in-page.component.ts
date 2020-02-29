import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../services/authentication/authentication.service";

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {

  private incorrectPassword: boolean;
  private userEmail: string;
  private userPassword: string;

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.incorrectPassword = false;

    if (localStorage.length > 0) {
      this.userEmail = JSON.parse(localStorage.getItem("user")).email;
    }

    this.userPassword = "";
  }

  login() {
    console.log("Log in button pressed");

    this.authenticationService.authenticate(this.userEmail, this.userPassword).subscribe(user => {
      console.log("LOGIN RETURNED USED: ");
      console.log(user);
      if (user._id != null) {
        localStorage.setItem("user", JSON.stringify(user));
        this.router.navigate(["/jobsPage"]);
      } else {
        this.userPassword = "";
        this.incorrectPassword = true;
      }
    });
  }
}
