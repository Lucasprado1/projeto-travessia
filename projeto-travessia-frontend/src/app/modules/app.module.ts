import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './routing/app-routing.module';
//import { LoginComponent } from '../components/login/login.component';
import { ReportsModule } from './generate-reports.module';
import { AppShellComponent } from '../components/app/app.component';

@NgModule({
  declarations: [AppShellComponent], // Declare apenas o LoginComponent
  imports: [BrowserModule, AppRoutingModule, ReportsModule],
  providers: [],
  bootstrap: [AppShellComponent], // Defina o LoginComponent como o componente raiz
})
export class AppModule {}
