import { Component, OnInit } from '@angular/core';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent implements OnInit {

  COLUMNS: Array<string> = ["city", "county", "id", "price", "etc..."];
  SELECTED_METRICS: Array<string> = [];
  SELECTED_FEATURES: Array<string> = [];

  constructor(private mongodbService: MongodbService, private router: Router) { }

  ngOnInit() {
  }

  moveColumn(event, element: string, originArray: Array<string>, destinationArray: Array<string>) {
    console.log("from " + originArray + " to " + destinationArray)

    if (originArray == this.COLUMNS) {
      this.COLUMNS = this.COLUMNS.filter(obj => obj !== element);
    } else if (originArray == this.SELECTED_FEATURES) {
      this.SELECTED_FEATURES = this.SELECTED_FEATURES.filter(obj => obj !== element);
    } else {
      this.SELECTED_METRICS = this.SELECTED_METRICS.filter(obj => obj !== element);
    }

    if (destinationArray == this.COLUMNS) {
      this.COLUMNS.push(element)
    } else if (destinationArray == this.SELECTED_FEATURES) {
      this.SELECTED_FEATURES.push(element)
    } else {
      this.SELECTED_METRICS.push(element)
    }
  }

  next() {
    this.router.navigate(['/query']);
  }
}
