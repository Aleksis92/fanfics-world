import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { AuthService} from './auth.service';
import { User } from '../models/user';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {

  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  dialogData: any;

  domain = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  get data(): User[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  createUser(user) {
    return this.httpClient.post(this.domain + '/users/saveUser', user , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
      if ((<any>data).message !== "success") {
        console.log((<any>data).message)
      } else {
        console.log((<any>data).message);
        this.dialogData = JSON.parse((<any>data).fanfic);
      }
    });
  }

  getAllUsers() {
    return this.httpClient.get(this.domain + '/users/allUsers' , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }}).subscribe(data => {
        this.dataChange.next(JSON.parse((<any>data).users));
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message)
      })
  }

  deleteDatabaseUsers(users) {
    return this.httpClient.post(this.domain + '/users/deleteUsers', users , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  changeDatabaseBlockUsers(users, status) {
    return this.httpClient.post(this.domain + '/users/changeUsersStatus', {users: users, status: status} , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  changeDatabaseUsersRole(users, role) {
    return this.httpClient.post(this.domain + '/users/changeUsersRole', {users: users, role: role} , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

}
