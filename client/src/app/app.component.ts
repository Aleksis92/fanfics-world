import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {FanficService} from './services/fanfic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(
    translate: TranslateService,
  ) {
    translate.setDefaultLang('en');

    translate.use(localStorage.getItem('lang'));
  }
}
