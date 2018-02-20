import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  domain = "http://localhost:3000";
  authToken;
  user;
  admin;
  _id;

  constructor(
    private httpClient: HttpClient,) {
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

  login(user) {
    return this.httpClient.post(this.domain + '/authentication/login/', user)
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserToken(token) {
    localStorage.setItem('token', token);
    this.authToken = token;
  }

  storeUserData(user) {
    this.user = user;
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

  isAdmin() {
    if (this.user || this.admin) {
      if (this.user.role == "Admin" || this.admin.role == "Admin") {
        return true
      }
    }
    return false;
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


}


