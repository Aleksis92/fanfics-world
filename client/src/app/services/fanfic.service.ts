import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { AuthService} from './auth.service';
import { UserFanfics } from '../models/user-fanfics';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class FanficService {

  dataChange: BehaviorSubject<UserFanfics[]> = new BehaviorSubject<UserFanfics[]>([]);
  dialogData: any;

  domain = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  get data(): UserFanfics[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  createFanficTitle(fanficTitle) {
    return this.httpClient.post(this.domain + '/fanfic/save', fanficTitle , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
      if ((<any>data).message !== "success") {
        console.log('fail')
      } else {
        console.log('success');
        this.dialogData = JSON.parse((<any>data).fanfic);
        console.log(this.dialogData)
      }
    });
  }

  getAllUserFanfics() {
    return this.httpClient.get<UserFanfics>(this.domain + '/fanfic/all' , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
      this.dataChange.next(JSON.parse((<any>data).fanfics));
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message)
      })
  }

  addChapter(chapter) {
    return this.httpClient.post(this.domain + '/fanfic/save/chapter', chapter , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }});
  }

}
