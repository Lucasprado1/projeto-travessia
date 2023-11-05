// reports.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateReportsComponent } from '../components/generate-reports/generate-reports.component';
import { HeaderComponent } from '../components/header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';


// Importe os módulos necessários do Angular Material

@NgModule({
  declarations: [GenerateReportsComponent, HeaderComponent],
  imports: [
    CommonModule, /* outros módulos necessários */
    RouterModule,
    BrowserModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    GenerateReportsComponent
  ],
  bootstrap: [GenerateReportsComponent]
})
export class ReportsModule {}
