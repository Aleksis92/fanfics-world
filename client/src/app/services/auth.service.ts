import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  domain = "http://localhost:3000";
  authToken;
  user;

  constructor(private httpClient: HttpClient) { }

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
    localStorage.setItem('role', user.role);
    this.user = user;
  }

  getProfile() {
    this.loadToken();
    return this.httpClient.get(this.domain + '/authentication/profile', { headers: {
      'authorization': this.authToken, 'content-type': 'application/json'
    }})
  }

  loggedIn() {
    return tokenNotExpired();
  }

}


