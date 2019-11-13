import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';

const routes: Routes = [
  {path: "", component: MarketingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
