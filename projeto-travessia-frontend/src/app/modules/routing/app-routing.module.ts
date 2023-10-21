// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateReportsComponent } from 'src/app/components/generate-reports/generate-reports.component';
import { LoginComponent } from 'src/app/components/login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent }, // Rota raiz para o LoginComponent
  { path: 'report', component: GenerateReportsComponent }, // Rota /report para o GenerateReportsComponent
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
