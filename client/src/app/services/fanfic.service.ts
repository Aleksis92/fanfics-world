import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { AuthService} from './auth.service';
import { UserFanfics } from '../models/user-fanfics';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class FanficService {

  dataChange: BehaviorSubject<UserFanfics[]> = new BehaviorSubject<UserFanfics[]>([]);
  newFanfic = new BehaviorSubject('');
  newFanficVisible = false;
  editFanficVisible = false;


  domain = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }


  newFanficToggle() {
    if (this.newFanficVisible) {
      this.newFanficVisible = false;
    } else {
      this.newFanficVisible = true;
    }
  }

  editFanficToggle() {
    if (this.editFanficVisible) {
      this.editFanficVisible = false;
    } else {
      this.editFanficVisible = true;
    }
  }

  get data(): UserFanfics[] {
    return this.dataChange.value;
  }

  createFanficTitle(fanficTitle) {
    return this.httpClient.post(this.domain + '/fanfic/saveFanfic', fanficTitle , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
      if ((<any>data).message !== "success") {
        console.log('fail')
      } else {
        console.log('success');
        this.newFanfic.next(JSON.parse((<any>data).fanfic))
      }
    });
  }

  getAllUserFanfics() {
    return this.httpClient.get(this.domain + '/fanfic/allUserFanfics' , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
      this.dataChange.next(JSON.parse((<any>data).fanfics));
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message)
      })
  }

  addChapter(chapter) {
    return this.httpClient.post(this.domain + '/fanfic/save/fanficChapter', chapter , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

}
