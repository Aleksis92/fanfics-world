import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
    )
  {
    this.createForm();
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert-info'});
    this.router.navigate(['/'])
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.formBuilder.group({
      search: '',
    });
  }

}
