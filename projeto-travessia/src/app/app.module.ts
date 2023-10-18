import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { RouterModule } from '@angular/router';
import { ReportGeneratorComponent } from './routes/report-generator/report-generator.component';
import { ReportGeneratorService } from './routes/report-generator/report-generator.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [ ReportGeneratorComponent],
  imports: [BrowserModule,
            MatProgressSpinnerModule,
            MatButtonModule,
            FormsModule,
            HttpClientModule,
            RouterModule.forRoot([ // Configure suas rotas aqui
    { path: '', component: ReportGeneratorComponent },
    // Outras rotas, se houver
  ]),
    BrowserAnimationsModule], // Adicione FormsModule aqui
  bootstrap: [ReportGeneratorComponent],
  providers: [ReportGeneratorService, HttpClient]
})
export class AppModule {}
