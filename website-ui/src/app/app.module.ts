import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { PasswordMathcValidatorDirective } from "./sign-up-page/password-match.directive";
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { JobComponent } from './jobs-page/job/job.component';
import { RunComponent } from './jobs-page/run/run.component';

import { AuthenticationGuardService } from '../services/routeGuards/authentication-guard.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { MongodbService } from '../services/mongodb/mongodb.service';
import { UserPageComponent } from './user-page/user-page.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { JobDetailsPageComponent } from './job-details-page/job-details-page.component';
import { CreateJobPageComponent } from './create-job-page/create-job-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MarketingPageComponent,
    LogInPageComponent,
    SignUpPageComponent,
    PasswordMathcValidatorDirective,
    JobsPageComponent,
    JobComponent,
    RunComponent,
    UserPageComponent,
    TopNavbarComponent,
    JobDetailsPageComponent,
    CreateJobPageComponent,
    DashboardPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    MongodbService,
    AuthenticationGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
