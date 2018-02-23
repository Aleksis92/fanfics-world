import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'chapter-reader',
  templateUrl: './chapter-reader.component.html',
  styleUrls: ['./chapter-reader.component.css']
})
export class ChapterReaderComponent implements OnInit {

  readableChapter;
  readChapter;

  @Input() readableFanfic;

  constructor() {}

  ngOnInit() {
  }

  showChapter(index) {
    this.readableChapter = this.readableFanfic.fanficChapters[index];
    this.readableChapter.index = index;
    this.readChapter = true;
  }
}
