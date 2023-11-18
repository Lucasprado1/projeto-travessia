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
          this.generateReport();
        },
        (error: any) => {
          console.error('Erro ao fazer o upload do arquivo:', error);
        }
      );

    }

  }

  createOperation(){
    // double check se templateName ta ok
    if (this.uploadedTemplate) {
      let extension = this.uploadedTemplate.name.split(".").slice(-1)[0];
      this.templateName = "modelo - "+ this.opId +"." + extension;
    }
    let overwriteModel = false;
    if(this.operations.map(op => op.value).includes(this.opId)){
      const dialogRef = this.dialog.open(OverwriteConfirmationDialogComponent, {
        maxWidth: '180%', 
        maxHeight: '30%',
        minWidth: '35%', 
      });
    
      dialogRef.afterClosed().subscribe(result => {

        if(result){
          // result voltou como true, então deve substituir a operação aqui
          this.openSnackBar('Substituindo operação.', 'Fechar');
          overwriteModel = true;
          this.reportGeneratorService.checkOpValues({idOperation: this.opId.replace(/\//g, "-"), excelName: this.templateName, overwriteModel: overwriteModel, userName: this.userEmail.split('@')[0]}).subscribe(
          (response: any) => {
            if (!this.uploadedTemplate) {
              alert('Por favor, selecione um arquivo Excel antes de enviar.');
              return;
            }
            this.reportGeneratorService.uploadTemplate(this.uploadedTemplate, this.templateName, overwriteModel).subscribe(
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
            console.error('Erro ao criar nova operação:', error);
          }
        );
        }
        else{
          this.openSnackBar('Substituição cancelada. Favor alterar o nome da nova operação.', 'Fechar');
          return;
        }
      });
    }
    else{
      this.reportGeneratorService.checkOpValues({idOperation: this.opId.replace(/\//g, "-"), excelName: this.templateName, overwriteModel: overwriteModel, userName: this.userEmail.split('@')[0]}).subscribe(
          (response: any) => {
            if (!this.uploadedTemplate) {
              alert('Por favor, selecione um arquivo Excel antes de enviar.');
              return;
            }
            this.reportGeneratorService.uploadTemplate(this.uploadedTemplate, this.templateName, overwriteModel).subscribe(
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
            console.error('Erro ao criar nova operação:', error);
          }
        );
    }
  
  }
 
  generateReport() {
    const dataToSend = {
      selectedOperation: this.selectedOperation.replace(/\//g, "-"),
      selectedDate: this.selectedDate,
      userEmail: this.userEmail.split('@')[0]
    };
    this.reportGeneratorService.sendData(dataToSend).subscribe(
      (response: any) => {
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


