import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './routing/app-routing.module';
import { LoginComponent } from '../components/login/login.component';
import { ReportsModule } from './generate-reports.module';
import { AppShellComponent } from '../components/app/app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { firebaseConfig } from '../firebase';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app'
import { AuthService } from '../components/shared/services/auth.service';


@NgModule({
  declarations: [AppShellComponent, LoginComponent], // Declare apenas o LoginComponent
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    FormsModule,
    CommonModule,
    ReportsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, AuthService],
  bootstrap: [AppShellComponent], // Defina o LoginComponent como o componente raiz
})
export class AppModule {}
