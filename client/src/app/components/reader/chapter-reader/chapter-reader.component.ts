import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'chapter-reader',
  templateUrl: './chapter-reader.component.html',
  styleUrls: ['./chapter-reader.component.css'],
})
export class ChapterReaderComponent implements OnInit {

  readableChapter;
  readChapter;
  readPercantege;

  @Input() readableFanfic;

  constructor() {}

  ngOnInit() {
    this.readPercantege = 0;
  }

  showChapter(index) {
    this.readableChapter = this.readableFanfic.fanficChapters[index];
    this.readableChapter.index = index;
    this.readChapter = true;
  }

  onScroll(event) {
    let scrollTop = event.srcElement.scrollTop;
    let scrollHeight = event.srcElement.scrollHeight;
    let viewportOffset = event.srcElement.getBoundingClientRect().height;
    this.readPercantege = Math.round(scrollTop/(scrollHeight-viewportOffset)*100);
    //console.log(scrollTop/(scrollHeight-viewportOffset)*100)
  }

  /*@HostListener('modal:scroll', ['$event'])
  doSomething(event) {
    // console.debug("Scroll Event", document.body.scrollTop);
    // see András Szepesházi's comment below
    console.debug("Scroll Event", window.pageYOffset );
  }*/
}
