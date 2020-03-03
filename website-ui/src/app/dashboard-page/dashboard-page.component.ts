import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  public jobId: string;
  public dashboardSrc: SafeResourceUrl;

  constructor(private route: ActivatedRoute, private sanatizer: DomSanitizer) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = params["job._id"];
      this.refreshIframeUrl();
    });
  }

  refreshIframeUrl() {
    this.dashboardSrc = this.sanatizer.bypassSecurityTrustResourceUrl("http://localhost:5601/app/kibana#/dashboard/" + this.jobId + "_dashboard?embed=true&_g=()");
  }
}
