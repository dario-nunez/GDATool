import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.css']
})
export class ExecuteComponent implements OnInit {
  jobId: string;
  ioDisabled: boolean = true;
  
  constructor(private mongodbService: MongodbService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.ioDisabled = false;
    });
  }

  submitAndRun() {
    console.log("Trigger Spark job")
    this.router.navigate(['/jobsPage']);
  }
}
