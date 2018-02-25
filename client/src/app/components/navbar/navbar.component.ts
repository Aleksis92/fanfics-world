import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FlashMessagesService} from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import {FanficService} from '../../services/fanfic.service';

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
    private flashMessagesService: FlashMessagesService,
    private translate: TranslateService
    )
  {
    this.createForm();
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert-info'});
    this.router.navigate(['/'])
  }

  onLangClick (language) {
    this.translate.use(language);
    localStorage.setItem('lang', language);
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.formBuilder.group({
      search: ['', Validators.required],
    });
  }

  onSearchSubmit() {
    let search = this.form.get('search').value;
    this.router.navigate(['/search/fanfic/:' + search]);
  }

}
