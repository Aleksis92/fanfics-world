import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {BlockUserDialogComponent} from '../block-user-dialog/block-user-dialog.component';

@Component({
  selector: 'app-role-user-dialog',
  templateUrl: './role-user-dialog.component.html',
  styleUrls: ['./role-user-dialog.component.css']
})
export class RoleUserDialogComponent{

  constructor(public dialogRef: MatDialogRef<BlockUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public userService: UserService) {
    this.data.role = 'Admin';
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
