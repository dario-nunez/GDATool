import { Component, OnInit, Input } from '@angular/core';
import { IStatusLine } from '../../../../models/statusLine.model';

@Component({
  selector: 'app-status-line',
  templateUrl: './status-line.component.html',
  styleUrls: ['./status-line.component.css']
})
export class StatusLineComponent implements OnInit {
  @Input()
  statusLine: IStatusLine;
  badgeColour: string;
  badgeText: string;

  constructor() { }

  ngOnInit() {
    if (this.statusLine.jobStatus >= this.statusLine.lineTriggerStatus) {
      this.badgeColour = "success";
      this.badgeText = "Done"
    } else if (this.statusLine.jobStatus + 1 == this.statusLine.lineTriggerStatus) {
      this.badgeColour = "warning";
      this.badgeText = "Pending"
    } else {
      this.badgeColour = "danger";
      this.badgeText = "To do"
    }
  }
}
