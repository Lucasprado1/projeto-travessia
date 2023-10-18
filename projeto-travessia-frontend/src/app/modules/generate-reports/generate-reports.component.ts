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
    {value: 'raposo', viewValue: 'Raposo'},
    {value: 'ibira', viewValue: 'Ibirapitanga'},
    {value: 'atmosfera', viewValue: 'Atmosfera'},
  ];
  

  onFileSelected(event: any) {
    // Quando um arquivo é selecionado no campo de upload
    this.uploadedFile = event.target.files[0];
    // this.filename = this.uploadedFile.name
    if(this.uploadedFile){
      console.log(this.uploadedFile.name)
      this.fileName = this.uploadedFile?.name;
    }
  }

  triggerFileInput() {
    console.log("clicou")
    // Aciona o input de arquivo quando a segunda div é clicada
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  generateReport(): void {
    console.log(this.selectedOperation);
    console.log(this.selectedDate);
    this.isGenerating = true;
    if (!this.uploadedFile) {
      // Certifique-se de que um arquivo foi carregado antes de enviar
      alert('Por favor, selecione um arquivo Excel antes de enviar.');
      return;
    }

    // Chame o serviço para fazer o upload do arquivo
    this.reportGeneratorService.uploadFile(this.uploadedFile).subscribe(
      response => {
        // Trate a resposta do backend, se necessário
        console.log('Resposta do servidor:', response);
        this.reportGenerated = true;
        this.isGenerating = false;
        // Limpe ou atualize a interface do usuário, se necessário
      },
      error => {
        console.error('Erro ao fazer o upload do arquivo:', error);
        // Lide com erros, se necessário
      }
    );
  }

  downloadReport(){
    // Implement report generation logic here
    // After generating the report, set reportGenerated to true and provide the download link.
    this.reportGeneratorService.generateReport().subscribe(response => {
      // Crie um objeto URL para o arquivo baixado
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      // Crie um link para fazer o download do arquivo
      const a = document.createElement('a');
      a.href = url;
      a.download = 'arquivo.xlsx';
      a.click();

      // Libere a URL criada para o objeto Blob
      window.URL.revokeObjectURL(url);
    });
  }
  
}
