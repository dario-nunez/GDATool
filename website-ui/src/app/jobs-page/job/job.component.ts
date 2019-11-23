import { OnInit, Component, Input } from "@angular/core";
import { IJob } from '../../../models/job.model';
import { IRun } from '../../../models/run.model';

@Component({
    selector: "app-job",
    templateUrl: "./job.component.html",
    styleUrls: ["./job.component.css"]
})
export class JobComponent implements OnInit {
    @Input()
    public job: IJob;

    cardColor;
    jobRuns: IRun[];
    pending = false;

    ngOnInit(): void {
        this.jobRuns = this.job.runs;

        console.log(this.job)

        if (this.job.jobStatus == "success") {
            this.cardColor = "border-success mb-3";
        } else if (this.job.jobStatus == "pending") {
            this.pending = true;
            this.cardColor = "border-warning mb-3";
        } else {
            this.cardColor = "border-danger mb-3"
        }
    }
}
