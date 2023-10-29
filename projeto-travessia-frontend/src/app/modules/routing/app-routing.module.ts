// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/components/auth.guard';
import { GenerateReportsComponent } from 'src/app/components/generate-reports/generate-reports.component';
import { LoginComponent } from 'src/app/components/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Rota de login
  {
    path: 'report',
    component: GenerateReportsComponent,
    children: [
      // Rotas aninhadas que ficarão sob a rota /report
      // Você pode adicionar rotas aninhadas aqui, se necessário
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Rota padrão: redireciona para login
  { path: '**', redirectTo: 'login' }, // Redireciona para login em caso de rota desconhecida
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
