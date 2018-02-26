import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { AuthService} from './auth.service';
import { UserFanfics } from '../models/user-fanfics';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TranslateService} from '@ngx-translate/core';
import {FlashMessagesService} from 'angular2-flash-messages';

@Injectable()
export class FanficService {

  dataChange: BehaviorSubject<UserFanfics[]> = new BehaviorSubject<UserFanfics[]>([]);
  newFanfic = new BehaviorSubject('');
  editFanfic = new BehaviorSubject('');
  editChapter = new BehaviorSubject('');
  newFanficVisible = false;
  fanficEditorVisible = false;
  cloudTags = [];
  addChapterVisible;
  editFanficVisible;
  editChapterVisible;
  currentChapter;
  currentFanfic;
  coverRefresh;
  readableMode = false;


  domain = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private translate: TranslateService,
    private flashMessagesService: FlashMessagesService
  ) { }


  newFanficToggle() {
    if (this.newFanficVisible) {
      setTimeout(() => {
      this.newFanficVisible = false;
      }, 500)
    } else {
      this.newFanficVisible = true;
      this.fanficEditorVisible = false;
    }
  }

  fanficEditorOpen(fanfic) {
    this.currentFanfic = fanfic;
    this.fanficEditorVisible = false;
    this.fanficEditorVisible = true;
    this.newFanficVisible = false;
    this.defaultFanficEditorConfig()
  }

  defaultFanficEditorConfig() {
    this.editFanficVisible = false;
    this.editChapterVisible = false;
    this.addChapterVisible = true;
  }

  get data(): UserFanfics[] {
    return this.dataChange.value;
  }

  createFanficTitleHTTP(fanficTitle) {
    return this.httpClient.post(this.domain + '/fanfic/save/fanfic', fanficTitle , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  updateFanficTitleHTTP(fanficTitle) {
    return this.httpClient.post(this.domain + '/fanfic/update/fanficTitle', fanficTitle , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  addFanficChapterHTTP(chapter) {
    return this.httpClient.post(this.domain + '/fanfic/save/fanficChapter', chapter , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

  editFanficChapterHTTP(chapter) {
    return this.httpClient.post(this.domain + '/fanfic/update/fanficChapter', chapter , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

  deleteFanficHTTP(fanfic) {
    return this.httpClient.post(this.domain + '/fanfic/delete/fanficTitle', fanfic , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

  deleteChapterHTTP(chapter) {
    return this.httpClient.post(this.domain + '/fanfic/delete/fanficChapter', chapter , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

  getAllUserFanfics(_id) {
    return this.httpClient.post(this.domain + '/fanfic/get/allUserFanfics', _id, { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
        this.dataChange.next(JSON.parse((<any>data).fanfics));
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message)
      })
  }

  getCloudTagsHTTP() {
    this.httpClient.get(this.domain + '/fanfic/get/cloudTags', {
      headers: {
        'authorization': 'all', 'content-type': 'application/json'
      }}).subscribe(data => {
        this.cloudTags = [];
        for(let tag of JSON.parse((<any>data).tags)) {
          this.cloudTags.push(tag.value);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message)
      });
  }

  getAllTagsHTTP() {
    return this.httpClient.get(this.domain + '/fanfic/get/cloudTags', {
      headers: {
        'authorization': 'all', 'content-type': 'application/json'
      }
    });
  }

  getTagFanficsHTTP(tag) {
    return this.httpClient.get(this.domain + '/fanfic/search/tag/:' + tag, {
      headers: {
        'authorization': 'all', 'content-type': 'application/json'
      }
    });
  }

  modifyCloudTagHTTP(modifyArray) {
    this.httpClient.post(this.domain + '/fanfic/update/cloudTags', modifyArray, { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }
    }).subscribe(data => {
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message)
      })
  }

  getLastUpdatedFanficsHTTP() {
    return this.httpClient.get(this.domain + '/fanfic/get/lastUpdatedFanfics', {
      headers: {
        'authorization': 'all', 'content-type': 'application/json'
      }
    });
  }

  getTopFanficsHTTP() {
    return this.httpClient.get(this.domain + '/fanfic/get/topFanfics', {
      headers: {
        'authorization': 'all', 'content-type': 'application/json'
      }
    });
  }

  getSearchFanficsHTTP(search) {
    return this.httpClient.get(this.domain + '/fanfic/get/searchFanfic/:' + search, {
      headers: {
        'authorization': 'all', 'content-type': 'application/json'
      }})
  }

  getReadableFanficHTTP(_id) {
    return this.httpClient.get(this.domain + '/fanfic/get/readableFanfic/:' + _id, { headers: {
        'authorization': 'all', 'content-type': 'application/json'
      }})
  }

  setChapterRatingHTTP(rating) {
    return this.httpClient.post(this.domain + '/fanfic/set/rating', rating, {
      headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }
    });
  }

  showFlashMessage(key, css) {
    this.translate.get(key).subscribe((res: string) => {
      this.flashMessagesService.show(res, {cssClass: css});
    });
  }

  getTranslate(key) {
    this.translate.get(key).subscribe((res: string) => {
      return res;
    });
  }

}
