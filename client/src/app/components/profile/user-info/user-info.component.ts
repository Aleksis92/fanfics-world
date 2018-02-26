import {Component, ViewChild} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {FanficService} from '../../../services/fanfic.service';
import {FileUploadComponent} from '../../file-upload/file-upload.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent{

  uploadVisible = false;
  @ViewChild(FileUploadComponent) fileUploadComponent;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fanficService: FanficService
  ) {}

  email = this.authService.user.email;

  saveEditable(value) {
    const email = {
      _id: this.authService.user._id,
      value: value
    };
    this.userService.editEmailHttp(email).subscribe(data => {
      if((<any>data).success) {
        this.userService.showFlashMessage((<any>data).message, 'alert-success')
      } else {
        this.userService.showFlashMessage((<any>data).message, 'alert-danger')
      }
    })
  }

  onImageClick() {
    this.uploadVisible = true;
  }

  onUploadCancel() {
    this.uploadVisible = false;
  }

  onEditAvatar() {
    const avatar = {
      _id: this.authService.user._id,
      cover: this.fileUploadComponent.downloadURL.value
    };
    this.userService.editAvatarHttp(avatar).subscribe(data => {
      if((<any>data).success) {
        this.uploadVisible = false;
        this.userService.showFlashMessage((<any>data).message, 'alert-success')
      } else {
        this.userService.showFlashMessage((<any>data).message, 'alert-danger')
      }
    })
  }

}
