import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenerateReportsService {
  // private apiUrl = 'http://localhost:5000'; 

  private apiUrl = 'https://2ddc-2804-431-c7dd-15d1-b815-4708-d078-bcf6.ngrok-free.app' ; 

  constructor(private http: HttpClient) {}

  generateReport(): Observable<any> {
    // Simulação de uma chamada HTTP para gerar um relatório
    // Substitua este código pela lógica real de geração de relatórios
    return this.http.get<any>(`${this.apiUrl}/arquivos/ModeloNEOEdited.xlsx`, {
      responseType: 'blob' as 'json' // Defina o responseType como blob
    });
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/arquivos`, formData);
  }

  sendData(dataToSend: object) {
    return this.http.post<any>(`${this.apiUrl}/data`, dataToSend);
  }
}