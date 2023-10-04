import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportGeneratorComponent } from './report-generator/report-generator.component';

const routes: Routes = [
  { path: '', component: ReportGeneratorComponent }, // Rota vazia (página inicial)
  // Outras rotas, se houver
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
