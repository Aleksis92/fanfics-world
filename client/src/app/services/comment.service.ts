import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class CommentService {

  socket;
  domain = "http://localhost:3000";

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
  ) { }

  addNewCommentHTTP(comment) {
    return this.httpClient.post(this.domain + '/comment/saveComment', comment , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  getAllCommentHTTP(fanficId) {
    return this.httpClient.get(this.domain + '/comment/get/allComments/:' + fanficId , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  addLikeHTTP(like) {
    return this.httpClient.post(this.domain + '/comment/like',  like , { headers: {
        'authorization': this.authService.authToken, 'content-type': 'application/json'
      }})
  }

  sendCommentWS(message){
    this.socket.emit('add-comment', message);
  }

  getCommentsWS() {
    let observable = new Observable(observer => {
      this.socket = io(this.domain);
      this.socket.on('comment', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
