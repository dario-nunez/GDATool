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

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit() {
    this.user = {
      email: "",
      username: "",
      password: ""
    } as IUser;
  }

  createUser() {
    this.mongodbService.createUser(this.user.email, this.user.password).subscribe(
      returnedUser => console.log("Returned created user: " + returnedUser)
    )
    
    this.router.navigate(['/jobsPage']);
  }
}
