import { Component } from '@angular/core';
import { GenerateReportsService } from './generate-reports';
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

  uploadedFile:  File | null = null;
  fileName: any;
  selectedDate: Date | null = null;
  selectedOperation: any;
  public isGenerating: boolean = false;
  public reportGenerated: boolean = false;
  public reportDownloadLink: string = '';
  constructor(private reportGeneratorService: GenerateReportsService) {
   
  }

  operations: Operation[] = [
    {value: 'Raposo', viewValue: 'Raposo'},
    {value: 'Ibira', viewValue: 'Ibirapitanga/Terra Luz'},
    {value: 'Atmosfera', viewValue: 'Atmosfera'},
    {value: 'Barbosa', viewValue: 'Barbosa'},
    {value: 'Barreiras', viewValue: 'Barreiras'},
    {value: 'FiveSenses', viewValue: 'Five Senses'},
    {value: 'GramPoeme', viewValue: 'Gram Poeme'},
    {value: 'LotesCia', viewValue: 'Lotes & Cia'},
    {value: 'Ommar', viewValue: 'Ommar'},
    {value: 'PatioLusitania', viewValue: 'Patio Lusitânia'},
    {value: 'EntreSerras', viewValue: 'Entre Serras/Residence'},
    {value: 'Pardini', viewValue: 'Pardini'},
    {value: 'Dpaula', viewValue: 'D` Paula'},
  ];
  

  onFileSelected(event: any) {
    this.uploadedFile = event.target.files[0];
    if(this.uploadedFile){
      console.log(this.uploadedFile.name)
      this.fileName = this.uploadedFile?.name;
    }
  }

  triggerFileInput() {
    console.log("clicou")
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  sendFile(): void { 
    this.isGenerating = true;
    if (!this.uploadedFile) {
      alert('Por favor, selecione um arquivo Excel antes de enviar.');
      return;
    }
    this.reportGeneratorService.uploadFile(this.uploadedFile).subscribe(
      response => {
        console.log('Resposta do servidor:', response);
        this.reportGenerated = true;
        this.isGenerating = false;
      },
      error => {
        console.error('Erro ao fazer o upload do arquivo:', error);
      }
    );
  }
  generateReport(){
    const dataToSend = {
      selectedOperation: this.selectedOperation,
      selectedDate: this.selectedDate
    };
    this.reportGenerated = false;
    this.reportGeneratorService.sendData(dataToSend).subscribe(
      response => {
        console.log('Resposta do servidor teste:', response);
      },
      error => {
        console.error('Erro ao fazer o upload do arquivo:', error);
      }
    );
    this.sendFile();
  }

  downloadReport(){
    this.reportGeneratorService.generateReport().subscribe(response => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'arquivo.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }
  
}
