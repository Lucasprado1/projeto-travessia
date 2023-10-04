import { Component } from '@angular/core';
import { ReportGeneratorService } from './report-generator.service';

@Component({
  selector: 'app-report-generator', // Verifique se o seletor corresponde ao elemento desejado no arquivo HTML
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.scss'],
})
export class ReportGeneratorComponent {
  public selectedOption: string = '';
  public reportGenerated: boolean = false;
  public reportDownloadLink: string = '';
  uploadedFile:  File | null = null; // Adicionado para rastrear o arquivo carregado
  constructor(private reportGeneratorService: ReportGeneratorService) {}
  

  generateReport(): void {
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
        // Limpe ou atualize a interface do usuário, se necessário
      },
      error => {
        console.error('Erro ao fazer o upload do arquivo:', error);
        // Lide com erros, se necessário
      }
    );
    this.reportGenerated = true;
  }

  onFileSelected(event: any) {
    // Quando um arquivo é selecionado no campo de upload
    this.uploadedFile = event.target.files[0];
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
