import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'fanfic-preview',
  templateUrl: './fanfic-preview.component.html',
  styleUrls: ['./fanfic-preview.component.css']
})
export class FanficPreviewComponent implements OnInit {

  @Input() fanfic;

  constructor() {
  }

  ngOnInit() {
  }

}
