import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenerateReportsService {

  private apiUrl = 'http://localhost:5000'; 

  // private apiUrl = 'https://aa22-2804-431-c7dd-15d1-b815-4708-d078-bcf6.ngrok-free.app' ; 


  constructor(private http: HttpClient) {}

  generateReport(dataToReceive: any): Observable<any> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420'
    });
    const options = {
      responseType: 'blob' as 'json', // Define o responseType como blob
      headers: headers // Adicione os cabeçalhos ao objeto de opções
    };

    return this.http.get<any>(`${this.apiUrl}/arquivos/EDT-${dataToReceive.selectedOperation}-${dataToReceive.userEmail}.xlsx`,  Object.assign({},{
      responseType: 'blob' as 'json', // Defina o responseType como blobs
    }, options)
    );
  }

  getOperations(){
    return this.http.get<any>(`${this.apiUrl}/operacoes`);
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/arquivos`, formData);
  }

  uploadTemplate(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/uploadModelo`, formData);
  }

  sendData(dataToSend: object) {
    return this.http.post<any>(`${this.apiUrl}/data`, dataToSend);
  }

  checkOpValues(opObject: any){
    return this.http.post<any>(`${this.apiUrl}/checkValues`, opObject);
  }
}