import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenerateReportsService {
 

  //private apiUrl = 'http://localhost:5000'; 

  private apiUrl = 'https://dbff-201-68-213-170.ngrok-free.app' ; //colar aqui o link referente a porta 5000 que apareceu no ngrok
  // não esquecer de salvar o arquivo CTRL + S
                                                        

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
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420'
    });

    const options = {
      headers: headers // Adicione os cabeçalhos ao objeto de opções
    };
    return this.http.get<any>(`${this.apiUrl}/operacoes`, options);
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/arquivos`, formData);
  }

  uploadTemplate(file: File, fileName: string, overwriteModel: any) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName); // Adiciona o nome do arquivo à FormData
    formData.append('overwriteModel', overwriteModel); // Adiciona o nome do arquivo à FormData
  
    return this.http.post<any>(`${this.apiUrl}/uploadModelo`, formData);
  }
  

  sendData(dataToSend: object) {
    return this.http.post<any>(`${this.apiUrl}/data`, dataToSend, {
      reportProgress: true,
      observe: 'events'
    }
  ,);
  }

  checkOpValues(opObject: any){
    return this.http.post<any>(`${this.apiUrl}/checkValues`, opObject);
  }
}