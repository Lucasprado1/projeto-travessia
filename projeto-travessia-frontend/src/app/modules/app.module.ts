import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './routing/app-routing.module';
import { LoginComponent } from '../components/login/login.component';
import { ReportsModule } from './generate-reports.module';

@NgModule({
  declarations: [LoginComponent], // Declare apenas o LoginComponent
  imports: [BrowserModule, AppRoutingModule, ReportsModule],
  providers: [],
  bootstrap: [LoginComponent], // Defina o LoginComponent como o componente raiz
})
export class AppModule {}
