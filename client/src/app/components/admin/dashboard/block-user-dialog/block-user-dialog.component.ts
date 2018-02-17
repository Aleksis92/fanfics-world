import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-block-user-dialog',
  templateUrl: './block-user-dialog.component.html',
  styleUrls: ['./block-user-dialog.component.css']
})
export class BlockUserDialogComponent {

  constructor(public dialogRef: MatDialogRef<BlockUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public userService: UserService) {
    this.data.status = 'Block';
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmBlock(): void {
    this.userService.dialogData = this.data;
  }
}
