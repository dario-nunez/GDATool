import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private mongodbService: MongodbService, private router: Router) { }

  ngOnInit() {
  }

  next() {
    this.router.navigate(['/schema']);
  }
}
