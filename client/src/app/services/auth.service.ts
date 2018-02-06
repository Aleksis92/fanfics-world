import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable()
export class AuthService {

  domain = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  registerUser(user) {
    return this.httpClient.post(this.domain + '/authentication/register', user);
}

  checkUsername(username) {
    return this.httpClient.get(this.domain + '/authentication/checkUsername/' + username);
  }

  checkEmail(email) {
    return this.httpClient.get(this.domain + '/authentication/checkEmail/' + email);
  }
}
