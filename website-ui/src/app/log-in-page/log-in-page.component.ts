import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {

  private loginForm: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loginForm = {
      email: "",
      password: ""
    };
  }

  login() {
    console.log("Log in button pressed");
  }
}
