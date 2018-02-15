import {Component, Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { UserFanfics } from '../../../../models/user-fanfics';
import { FanficService} from '../../../../services/fanfic.service';
import { FileUploadComponent } from '../../../file-upload/file-upload.component';

@Component({
  selector: 'app-add-fanfic-dialog',
  templateUrl: './add-fanfic-dialog.component.html',
  styleUrls: ['./add-fanfic-dialog.component.css']
})
export class AddFanficDialogComponent{

  @ViewChild(FileUploadComponent) fileUploadComponent;

  constructor(public dialogRef: MatDialogRef<AddFanficDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserFanfics,
              public fanficService: FanficService) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.data.cover = this.fileUploadComponent.downloadURL.value;
    this.fanficService.createFanficTitle(this.data)
  }
}
