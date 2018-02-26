import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { tokenNotExpired } from 'angular2-jwt';
import {FlashMessagesService} from 'angular2-flash-messages';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AuthService {

  domain = "http://localhost:3000";
  authToken;
  user;
  admin;
  isAdmin;
  _id;

  constructor(private httpClient: HttpClient,
              private translate: TranslateService,
              private flashMessagesService: FlashMessagesService) {
    this.checkAuth()
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user) {
    return this.httpClient.post(this.domain + '/authentication/register', user);
  }

  checkUsername(username) {
    return this.httpClient.get(this.domain + '/authentication/checkUsername/' + username);
  }

  checkEmail(email) {
    return this.httpClient.get(this.domain + '/authentication/checkEmail/' + email);
  }

  verifyEmailHTTP(_id, hash) {
    return this.httpClient.get(this.domain + '/authentication/verify/' + _id + '/' + hash);
  }

  login(user) {
    return this.httpClient.post(this.domain + '/authentication/login/', user)
  }

  logout() {
    this.authToken = false;
    this.user = false;
    this.admin = false;
    this.isAdmin = false;
    localStorage.removeItem('token');
  }

  storeUserToken(token) {
    localStorage.setItem('token', token);
    this.authToken = token;
  }

  storeUserData(user) {
    this.user = user;
    if(user.role == "Admin") {
      this.isAdmin = true;
    }
  }

  getProfile() {
    this.loadToken();
    return this.httpClient.get(this.domain + '/authentication/profile', { headers: {
      'authorization': this.authToken, 'content-type': 'application/json'
    }})
  }

  getSerfProfile(_id) {
    this.loadToken();
    return this.httpClient.get(this.domain + '/authentication/profile/' + _id, { headers: {
        'authorization': this.authToken, 'content-type': 'application/json'
      }})
  }

  loggedIn() {
    return tokenNotExpired();
  }

  isBlocked() {
    if (this.user) {
      if (this.user.status == "Unblock") {
        return true
      }
    }
    return false;
  }

  checkAuth() {
    if (!this.user && this.loggedIn()) {
      this.getProfile().subscribe(data => {
        this.user = (<any>data).user;
      })
    }
  }

  AdminSerfEnd() {
        this.user = this.admin;
        this.admin = undefined;
  }

  showFlashMessage(key, css) {
    console.log(key)
    this.translate.get(key).subscribe((res: string) => {
      this.flashMessagesService.show(res, {cssClass: css});
    });
  }

  getTranslate(key) {
    console.log(key)
    this.translate.get(key).subscribe((res: string) => {
      return res;
    });
  }

}


