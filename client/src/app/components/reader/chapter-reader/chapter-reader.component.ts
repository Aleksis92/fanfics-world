import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FanficService} from '../../../services/fanfic.service';

@Component({
  selector: 'chapter-reader',
  templateUrl: './chapter-reader.component.html',
  styleUrls: ['./chapter-reader.component.css'],
})
export class ChapterReaderComponent implements OnInit {

  readableChapter;
  readChapter;
  readPercantege;
  averageRating;
  summaryRating;
  readonly;

  @Input() readableFanfic;

  constructor(private authService: AuthService,
              private fanficService: FanficService) {
  }

  ngOnInit() {
    this.readPercantege = 0;
  }

  showChapter(index) {
    this.readableChapter = this.readableFanfic.fanficChapters[index];
    this.readableChapter.index = index;
    this.readChapter = true;
    this.checkReadOnly(this.readableChapter.rating);
    this.calculateAverageRating();
  }

  onScroll(event) {
    let scrollTop = event.srcElement.scrollTop;
    let scrollHeight = event.srcElement.scrollHeight;
    let viewportOffset = event.srcElement.getBoundingClientRect().height;
    this.readPercantege = scrollTop / (scrollHeight - viewportOffset) * 100;
  }

  calculateAverageRating() {
    let sum = 0;
    if (this.readableChapter.rating) {
      for (let rating of this.readableChapter.rating) {
        sum += rating.number;
      }
      this.summaryRating = sum;
      this.averageRating = Math.round(this.summaryRating / this.readableChapter.rating.length);
      console.log(this.averageRating);
    } else {
      this.averageRating = 0;
    }
  }

  getChapterIndex() {
    return this.readableFanfic.fanficChapters.findIndex(chapters => chapters._id == this.readableChapter._id);
  }

  onRatingClicked(ratingNumber) {
    this.updateAverageRating(ratingNumber);
    if (ratingNumber) {
      const rating = {
        number: ratingNumber,
        createdBy: this.authService.user._id,
        fanficChapterId: this.readableChapter._id,
        averageFanficRating: this.averageRating
      };
      this.setChapterRating(rating, ratingNumber);
    }
  }

  setChapterRating(rating, ratingNumber) {
    this.fanficService.setChapterRatingHTTP(rating).subscribe(data => {
      if ((<any>data).success) {
        this.readonly = true;
      }
    });
  }

  updateAverageRating(ratingNumber) {
    if (this.readableChapter.rating) {
      this.averageRating = (this.summaryRating + ratingNumber) / (this.readableChapter.rating.length + 1);
    }
    else {
      this.averageRating = ratingNumber;
    }
  }

  checkReadOnly(ratings) {
    if (!this.authService.user) {
      this.readonly = true;
    } else {
      for (let rating of ratings) {
        if (rating.createdBy == this.authService.user._id) {
          this.readonly = true;
        }
      }
    }
  }

}
