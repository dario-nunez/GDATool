import { Component, OnInit, Input } from '@angular/core';
import { IRun } from '../../../models/run.model';

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {
  @Input()
  public run: IRun;

  pillColor;
  pillText;

  ngOnInit() {
    if (this.run.runStatus == "success") {
      this.pillColor = "badge-success";
    } else if (this.run.runStatus == "pending") {
      this.pillColor = "badge-warning";
    } else {
      this.pillColor = "badge-danger"
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let startDay = this.run.timeStarted.getDay();
    let startMonth = monthNames[this.run.timeStarted.getMonth()];
    let startHour = this.run.timeStarted.getHours();
    let startMinute = this.run.timeStarted.getMinutes();
  
    let startDate = startMonth + " " + startDay + " • " + startHour + ":" + startMinute;

    let finishDay = this.run.timeFinished.getDay();
    let finishMonth = monthNames[this.run.timeFinished.getMonth()];
    let finishHour = this.run.timeFinished.getHours();
    let finishMinute = this.run.timeFinished.getMinutes();

    let finishDate = finishMonth + " " + finishDay + " • " + finishHour + ":" + finishMinute;

    if (this.run.runStatus == "pending") {
      this.pillText = startDate + " --- ...";
    } else {
      this.pillText = startDate + " --- " + finishDate;
    }
  }
}
