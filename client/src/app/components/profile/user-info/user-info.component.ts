import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent{

  constructor(
    private authService: AuthService,
  ) {}

  email = this.authService.user.email;

  saveEditable(value) {
    //call to http service
    console.log('http.service: ' + value);
  }

}
