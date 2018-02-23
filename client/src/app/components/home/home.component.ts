import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FanficService} from '../../services/fanfic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lastUpdatedFanfic;

  constructor(
    private authService: AuthService,
    private fanficService: FanficService
  ) {
  }

  ngOnInit() {
    this.fanficService.getLastUpdatedFanficsHTTP().subscribe(data => {
      this.lastUpdatedFanfic = JSON.parse((<any>data).fanfics);
    })
  }

}
