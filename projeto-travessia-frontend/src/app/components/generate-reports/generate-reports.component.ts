import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GenerateReportsService } from './generate-reports';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OverwriteConfirmationDialogComponent } from './overwrite-confirmation-dialog/overwrite-confirmation-dialog.component';
interface Operation {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-generate-reports',
  templateUrl: './generate-reports.component.html',
  styleUrls: ['./generate-reports.component.scss'],
})
export class GenerateReportsComponent implements OnInit{
  user: any;
  invalidFile: boolean = false;
  invalidTemplate: boolean = false;
  userEmail: any;
  uploadedFile: File | null = null;
  uploadedTemplate: File | null = null;
  fileName: any;
  templateName: any;
  selectedDate: Date | null = null;
  selectedOperation: any;
  public isCreatingNewOp: boolean = false;
  public opId: string = '';
  public isGenerating: boolean = false;
  public reportGenerated: boolean = false;
  public reportDownloadLink: string = '';

  constructor(
    private reportGeneratorService: GenerateReportsService,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
      this.userEmail = user?.email;
    });
  }
  
  ngOnInit(): void {
    this.updateOperations();
    // this.abrirDialog();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000,
      panelClass: ['custom-snackbar']
    });
  }

  changeOption(){
    this.isCreatingNewOp = !this.isCreatingNewOp;
  }

  downloadTemplate(){
    const excelFilePath = 'assets/Modelo Relatório - NEO.xlsx'; 

    const a = document.createElement('a');
    a.href = excelFilePath;
    a.download = 'template_modelo_NEO.xlsx';
    a.click();
  }
 
  operations: Operation[] = [];

  onFileSelected(event: any) {
    this.uploadedFile = event.target.files[0];
    console.log(event.target.files[0])
    if (this.uploadedFile) {
      this.fileName = this.uploadedFile?.name;
      if (this.fileName.slice(-4) != 'xlsx' && this.fileName.slice(-4) != 'xlsb') {
        this.openSnackBar('Certifique-se de enviar arquivos com as extensões .xlsx ou .xlsb', 'Fechar');
        this.invalidFile = true;
      }
      else {
        this.invalidFile = false;
      }
    }
  }

  onTemplateSelected(event: any) {
    this.uploadedTemplate = event.target.files[0];
    if (this.uploadedTemplate) {
      let extension = this.uploadedTemplate.name.split(".").slice(-1)[0];
      this.templateName = "modelo - "+ this.opId +"." + extension;
      console.log(this.templateName);
      if (this.templateName.slice(-4) != 'xlsx' && this.templateName.slice(-4) != 'xlsb') {
        this.openSnackBar('Certifique-se de enviar arquivos com as extensões .xlsx ou .xlsb', 'Fechar');
        this.invalidTemplate = true;
      }
      else {
        this.invalidTemplate = false;
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  triggerTemplateInput() {
    const templateInput = document.getElementById('templateInput') as HTMLInputElement;
    if (templateInput) {
      templateInput.click();
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

  createOperation(){
    console.log(this.opId)
    console.log(this.templateName)
    console.log(this.uploadedTemplate)
    /* aqui devemos conferir se o nome da operação + nome de excel são únicos no nosso controle, ou seja, 
    não pode existir nem um ID operação igual nem um nome de excel-modelo igual */

    // Função que verifica se podemos criar nova op e insere em nosso excel de controle caso não tenha duplicata
    this.reportGeneratorService.checkOpValues({idOperation: this.opId.replace(/\//g, "-"), excelName: this.templateName}).subscribe(
      (response: any) => {
        if (!this.uploadedTemplate) {
          alert('Por favor, selecione um arquivo Excel antes de enviar.');
          return;
        }
        this.reportGeneratorService.uploadTemplate(this.uploadedTemplate, this.templateName).subscribe(
          (response: any) => {
            this.updateOperations();
            this.openSnackBar('Operação criada com sucesso!', 'Fechar');
          },
          (error: any) => {
            console.error('Falha ao subir modelo:', error);
            this.openSnackBar('Erro no upload do modelo', 'Fechar');
          }
        );
      },
      (error: any) => {
        // console.error('Erro ao criar nova operação:', error);
        if(error.status == 400){
          this.abrirDialog();
        }
      }
    );
    
  }
  abrirDialog(): void {
    const dialogRef = this.dialog.open(OverwriteConfirmationDialogComponent, {
      maxWidth: '180%', 
      maxHeight: '30%',
      minWidth: '35%', 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog fechado. Resultado: ${result}`);
      if(result){
        // result voltou como true, então deve substituir a operação aqui
        this.openSnackBar('Substituindo operação.', 'Fechar');
      }
      else{
        this.openSnackBar('Substituição cancelada. Favor alterar o nome da nova operação.', 'Fechar');
      }
    });
  }

  generateReport() {
    const dataToSend = {
      selectedOperation: this.selectedOperation.replace(/\//g, "-"),
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
      selectedOperation: String = this.selectedOperation.replace(/\//g, "-"),
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
      // this.selectedOperation = '';
      // this.updateOperations();
      location.reload();
    });
    
  }

  updateOperations(){
    this.cdr.detectChanges();
    this.reportGeneratorService.getOperations().subscribe(
      (response: any) => {
        this.operations = [];
        response.forEach((op: any) => {
          this.operations.push({value: op, viewValue: op})
        })
        this.isCreatingNewOp = false;
      },
      (error: any) => {
        console.error('Erro ao puxar operacoes:', error);
      }
    );
  }

}


