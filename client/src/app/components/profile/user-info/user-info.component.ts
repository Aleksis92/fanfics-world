import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  username;
  email;
  photoUrl;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = (<any>profile).user.username;
      this.email = (<any>profile).user.email;
      this.photoUrl = (<any>profile).user.photoUrl;
    })
  }


}
