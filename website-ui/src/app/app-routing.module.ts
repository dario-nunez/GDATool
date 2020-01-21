import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { JobDetailsPageComponent } from './job-details-page/job-details-page.component';
import { AuthenticationGuardService } from '../services/routeGuards/authentication-guard.service';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DetailsComponent } from './create-job-page/details/details.component';
import { UploadComponent } from './create-job-page/upload/upload.component';
import { SchemaComponent } from './create-job-page/schema/schema.component';
import { QueryComponent } from './create-job-page/query/query.component';
import { ExecuteComponent } from './create-job-page/execute/execute.component';

const routes: Routes = [
  {path: "", component: MarketingPageComponent},
  {path: "logIn", component: LogInPageComponent},
  {path: "signUp", component: SignUpPageComponent},
  {path: "jobsPage", component: JobsPageComponent, canActivate: [AuthenticationGuardService]},
  {path: "userPage", component: UserPageComponent, canActivate: [AuthenticationGuardService]},
  {path: "jobDetailsPage/:job._id", component: JobDetailsPageComponent, canActivate: [AuthenticationGuardService]},
  {path: "details", component: DetailsComponent, canActivate: [AuthenticationGuardService]},
  {path: "upload/:job._id", component: UploadComponent, canActivate: [AuthenticationGuardService]},
  {path: "schema/:job._id", component: SchemaComponent, canActivate: [AuthenticationGuardService]},
  {path: "query/:job._id", component: QueryComponent, canActivate: [AuthenticationGuardService]},
  {path: "execute/:job._id", component: ExecuteComponent, canActivate: [AuthenticationGuardService]},
  {path: "dashboardPage/:job._id", component: DashboardPageComponent, canActivate: [AuthenticationGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
