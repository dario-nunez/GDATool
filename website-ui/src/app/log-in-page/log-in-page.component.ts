import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../services/authentication/authentication.service";

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {

  private userEmail: string;
  private userPassword: string;

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.userEmail = "";
    this.userPassword = "";
  }

  login() {
    console.log("Log in button pressed");
    if (this.authenticationService.login(this.userEmail, this.userPassword)) {
      this.router.navigate(["/jobsPage"]);
    }
    
    // this.authenticationService.getAllUsers().subscribe(user => {
    //   console.log(user);
    // });
  }
}
