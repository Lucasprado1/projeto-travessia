import { Component } from '@angular/core';
import { GenerateReportsService } from './generate-reports';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Operation {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-generate-reports',
  templateUrl: './generate-reports.component.html',
  styleUrls: ['./generate-reports.component.scss'],
})
export class GenerateReportsComponent {
  user: any;
  invalidFile: boolean = false;
  userEmail: any;
  uploadedFile: File | null = null;
  fileName: any;
  selectedDate: Date | null = null;
  selectedOperation: any;
  public isGenerating: boolean = false;
  public reportGenerated: boolean = false;
  public reportDownloadLink: string = '';
  constructor(
    private reportGeneratorService: GenerateReportsService,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
      this.userEmail = user?.email;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000,
      panelClass: ['custom-snackbar']
    });
  }

  operations: Operation[] = [
    { value: 'Raposo', viewValue: 'Raposo' },
    { value: 'Ibira', viewValue: 'Ibirapitanga/Terra Luz' },
    { value: 'Atmosfera', viewValue: 'Atmosfera' },

    { value: 'FiveSenses', viewValue: 'Five Senses' },
    // {value: 'Barbosa', viewValue: 'Barbosa'},
    // {value: 'Barreiras', viewValue: 'Barreiras'},
    // {value: 'GramPoeme', viewValue: 'Gram Poeme'},
    // {value: 'LotesCia', viewValue: 'Lotes & Cia'},
    // {value: 'Ommar', viewValue: 'Ommar'},
    // {value: 'PatioLusitania', viewValue: 'Patio Lusitânia'},
    // {value: 'EntreSerras', viewValue: 'Entre Serras/Residence'},
    // {value: 'Pardini', viewValue: 'Pardini'},
    // {value: 'Dpaula', viewValue: 'D` Paula'},
  ];


  onFileSelected(event: any) {
    this.uploadedFile = event.target.files[0];
    if (this.uploadedFile) {

      this.fileName = this.uploadedFile?.name;
      if (this.fileName.slice(-4) != 'xlsx' || this.fileName.slice(-4) != 'xlsb') {
        this.openSnackBar('Certifique-se de enviar arquivos com as extensões .xlsx ou .xlsb', 'Fechar');
        this.invalidFile = true;
      }
      else {
        this.invalidFile = false;
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  sendFile(): void {
    if (this.invalidFile) {
      this.openSnackBar('Existem campos inválidos', 'Fechar');
    }
    else {
      this.isGenerating = true;
      this.reportGenerated = false;
      if (!this.uploadedFile) {
        alert('Por favor, selecione um arquivo Excel antes de enviar.');
        return;
      }

      this.reportGeneratorService.uploadFile(this.uploadedFile).subscribe(
        (response: any) => {
          console.log('Resposta do servidor:', response);
          this.generateReport();
        },
        (error: any) => {
          console.error('Erro ao fazer o upload do arquivo:', error);
        }
      );

    }

  }
  generateReport() {
    const dataToSend = {
      selectedOperation: this.selectedOperation,
      selectedDate: this.selectedDate,
      userEmail: this.userEmail.split('@')[0]
    };
    this.reportGeneratorService.sendData(dataToSend).subscribe(
      (response: any) => {
        console.log('Resposta do servidor teste:', response);
        this.isGenerating = false;
        this.reportGenerated = true;
      },
      (error: any) => {
        console.error('Erro ao fazer o upload do arquivo:', error);
      }
    );
    // this.sendFile();
  }

  downloadReport() {
    const dataToReceive = {
      selectedOperation: String = this.selectedOperation,
      userEmail: String = this.userEmail.split('@')[0]
    };
    this.reportGeneratorService.generateReport(dataToReceive).subscribe((response: BlobPart) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = "Relatorio_" + this.selectedOperation + "_" + moment(this.selectedDate).format("MM-YYYY") + '.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }

}


