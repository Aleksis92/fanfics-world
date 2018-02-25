import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FanficService} from '../../services/fanfic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  lastUpdatedFanfics;
  topFanfics;

  constructor(
    private authService: AuthService,
    private fanficService: FanficService
  ) {
  }

  ngOnInit() {
    this.getLastUpdatedFanfics();
    this.getTopFanfics();
  }

  getLastUpdatedFanfics() {
    this.fanficService.getLastUpdatedFanficsHTTP().subscribe(data => {
      this.lastUpdatedFanfics = JSON.parse((<any>data).fanfics);
    })
  }

  getTopFanfics() {
    this.fanficService.getTopFanficsHTTP().subscribe(data => {
      this.topFanfics = JSON.parse((<any>data).fanfics);
    })
  }

}
