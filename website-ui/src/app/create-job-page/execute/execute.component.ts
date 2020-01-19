import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.css']
})
export class ExecuteComponent implements OnInit {

  constructor(private mongodbService: MongodbService, private router: Router) { }

  ngOnInit() {
  }

  next() {
    this.router.navigate(['/jobsPage']);
  }
}
