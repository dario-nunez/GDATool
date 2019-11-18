import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {

  loggedInUser: string;

  constructor() { }

  ngOnInit() {
    this.loggedInUser = localStorage.getItem("username");
  }

  logOut() {
    localStorage.clear();
  }
}
