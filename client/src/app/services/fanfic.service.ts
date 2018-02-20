import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { AuthService} from './auth.service';
import { UserFanfics } from '../models/user-fanfics';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class FanficService {

  dataChange: BehaviorSubject<UserFanfics[]> = new BehaviorSubject<UserFanfics[]>([]);
  newFanfic = new BehaviorSubject('');
  editFanfic = new BehaviorSubject('');
  editChapter = new BehaviorSubject('');
  newFanficVisible = false;
  fanficEditorVisible = false;
  addChapterVisible;
  editFanficVisible;
  editChapterVisible;
  currentChapter;
  currentFanfic;
  coverRefresh;


  domain = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
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
    this.fanficEditorVisible = true;
    this.newFanficVisible = false;
    this.defaultFanficEditorConfig()
  }

  get data(): UserFanfics[] {
    return this.dataChange.value;
  }

  createFanficTitle(fanficTitle) {
    return this.httpClient.post(this.domain + '/fanfic/save/fanfic', fanficTitle , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  updateFanficTitle(fanficTitle) {
    return this.httpClient.post(this.domain + '/fanfic/update/fanficTitle', fanficTitle , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  getAllUserFanfics(_id) {
    return this.httpClient.post(this.domain + '/fanfic/get/allUserFanfics' , _id, { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
      this.dataChange.next(JSON.parse((<any>data).fanfics));
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message)
      })
  }

  addFanficChapter(chapter) {
    return this.httpClient.post(this.domain + '/fanfic/save/fanficChapter', chapter , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

  editFanficChapter(chapter) {
    return this.httpClient.post(this.domain + '/fanfic/update/fanficChapter', chapter , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

  defaultFanficEditorConfig() {
    this.editFanficVisible = false;
    this.editChapterVisible = false;
    this.addChapterVisible =true;
  }

}
