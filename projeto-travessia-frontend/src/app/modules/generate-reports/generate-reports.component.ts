import { Component } from '@angular/core';
interface Food {
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

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Raposo'},
    {value: 'pizza-1', viewValue: 'Sei la'},
    {value: 'tacos-2', viewValue: 'Outro'},
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
  
}
