import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-overwrite-confirmation-dialog',
  templateUrl: './overwrite-confirmation-dialog.component.html',
  styleUrls: ['./overwrite-confirmation-dialog.component.scss']
})
export class OverwriteConfirmationDialogComponent {
  buttonDoubleCheck: boolean = false;
  confirmationCounting: number = 0;


  ngOnInit(): void {
    
  }

  constructor(private dialogRef: MatDialogRef<OverwriteConfirmationDialogComponent>) {}

  fecharDialog(confirmation: boolean): void {
    this.dialogRef.close(confirmation);
  }

  overwriteConfirmation(){
    this.buttonDoubleCheck = true;
    this.confirmationCounting = this.confirmationCounting + 1;
    if(this.confirmationCounting > 1){
      this.fecharDialog(true);
    }
  }

}
