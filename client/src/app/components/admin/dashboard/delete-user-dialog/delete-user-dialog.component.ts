import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UserService} from '../../../../services/user.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent{

  constructor(public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public userService: UserService) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
