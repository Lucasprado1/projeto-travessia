import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateReportsComponent } from './modules/generate-reports/generate-reports.component';

const routes: Routes = [
  { path: '', component: GenerateReportsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
