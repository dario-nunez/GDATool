import { Component, OnInit } from '@angular/core';
import { SchemaService } from 'src/services/schema/schema.service';

@Component({
  selector: 'app-general-plots',
  templateUrl: './general-plots.component.html',
  styleUrls: ['./general-plots.component.css']
})
export class GeneralPlotsComponent implements OnInit {
  COLUMNS: Array<string> = [];
  availableColumns: Array<string> = [];
  chosenXColumn: string = "";
  chosenYColumn: string = "";
  chosenIdentifierColumn: string;

  constructor(private schemaService: SchemaService) {}

  ngOnInit() {

       // Load feature columns
       this.schemaService.featureColumns.forEach(element => {
        this.COLUMNS.push(element[0]);
        this.availableColumns.push(element[0]);
      });
  
      // Load metric columns
      this.schemaService.metricColumns.forEach(element => {
        this.COLUMNS.push(element[0]);
        this.availableColumns.push(element[0]);
      });
  }

  selectXColumn(event, column) {
    console.log(column)
  }

  selectYColumn(event, column) {
    console.log(column)
  }
} 
