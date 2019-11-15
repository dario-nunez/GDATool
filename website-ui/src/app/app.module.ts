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

import { AuthenticationService } from '../services/authentication/authentication.service';
import { MongodbService } from '../services/mongodb/mongodb.service';

@NgModule({
  declarations: [
    AppComponent,
    MarketingPageComponent,
    LogInPageComponent,
    SignUpPageComponent,
    PasswordMathcValidatorDirective,
    JobsPageComponent,
    JobComponent,
    RunComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    MongodbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
