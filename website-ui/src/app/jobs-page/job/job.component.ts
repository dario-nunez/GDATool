import { OnInit, Component, Input } from "@angular/core";
import { Router } from '@angular/router';
import { IStatusLine } from 'src/models/statusLine.model';
import { IJobModel } from '../../../../../mongodb-service/src/models/jobModel';

@Component({
    selector: "app-job",
    templateUrl: "./job.component.html",
    styleUrls: ["./job.component.css"]
})
export class JobComponent implements OnInit {
    @Input()
    public job: IJobModel;

    cardColor;
    isPending = false;
    statusLines: IStatusLine[];

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.createStatusLines();

        if (this.job.jobStatus < 5) {
            this.cardColor = "border-warning mb-3";
            this.isPending = true;
        } else {
            this.cardColor = "border-success mb-3";
        }
    }

    createStatusLines() {
        this.statusLines = [
            {
                jobStatus: this.job.jobStatus,
                lineText: "Details",
                lineTriggerStatus: 1
            },
            {
                jobStatus: this.job.jobStatus,
                lineText: "Upload",
                lineTriggerStatus: 2
            },
            {
                jobStatus: this.job.jobStatus,
                lineText: "Schema",
                lineTriggerStatus: 3
            },
            {
                jobStatus: this.job.jobStatus,
                lineText: "Query",
                lineTriggerStatus: 4
            },
            {
                jobStatus: this.job.jobStatus,
                lineText: "Execute",
                lineTriggerStatus: 5
            }
        ]
    }

    jobNameLink() {
        switch (this.job.jobStatus) {
            case (1):
                this.router.navigate(['/upload', this.job._id]);
                break;

            case (2):
                this.router.navigate(['/schema', this.job._id]);
                break;

            case (3):
                this.router.navigate(['/schema', this.job._id]);
                break;

            case (4):
                this.router.navigate(['/execute', this.job._id]);
                break;

            default:
                this.router.navigate(['/jobDetailsPage', this.job._id]);
                break;
        }
    }
}
