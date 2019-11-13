import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';

const routes: Routes = [
  {path: "", component: MarketingPageComponent},
  {path: "logIn", component: LogInPageComponent},
  {path: "signUp", component: SignUpPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
