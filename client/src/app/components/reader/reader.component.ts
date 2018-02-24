import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FanficService} from '../../services/fanfic.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {

  readableFanfic;

  constructor(
    private route: ActivatedRoute,
    private fanficService: FanficService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.fanficService.getReadableFanficHTTP(this.route.snapshot.params['_id'].replace(":", "")).subscribe(data => {
      this.readableFanfic = JSON.parse((<any>data).fanfic);
    })
  }

}
