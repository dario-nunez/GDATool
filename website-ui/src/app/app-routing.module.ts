import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';

const routes: Routes = [
  {path: "", component: MarketingPageComponent},
  {path: "logIn", component: LogInPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
