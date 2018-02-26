import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommentService} from '../../../services/comment.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'chapter-comments',
  templateUrl: './chapter-comments.component.html',
  styleUrls: ['./chapter-comments.component.css']
})
export class ChapterCommentsComponent implements OnInit, OnDestroy {


  form: FormGroup;
  currentComments;
  connection;
  @Input() readableFanfic;

  constructor(private formBuilder: FormBuilder,
              private commentService: CommentService,
              private authService: AuthService) {
    this.form = this.formBuilder.group({
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllComments();
    this.getComment()
  }

  getAllComments() {
    this.commentService.getAllCommentHTTP(this.readableFanfic._id).subscribe(data => {
      if ((<any>data).success) {
        this.currentComments = JSON.parse((<any>data).comments);
      }
    });
  }

  sendComment(comment) {
    this.commentService.sendCommentWS(comment);
  }

  getComment() {
    this.connection = this.commentService.getCommentsWS().subscribe(comment => {
      this.currentComments.push((<any>comment).comment);
    });
  }

  onLike(comment) {

    const like = {
      _id: comment._id,
      createdBy: this.readableFanfic.createdBy._id
    };
    this.commentService.addLikeHTTP(like).subscribe(data => {
      if ((<any>data).success) {
        const comment = JSON.parse((<any>data).comment);
        const foundIndex = this.currentComments.findIndex(commentIterable => commentIterable._id == comment._id);
        this.currentComments[foundIndex].likes = comment.likes;
      }
    });
  }

  checkRepeatLike(comment) {
    let repeat = false;
    for (let like of comment.likes) {
      if (like.createdBy == this.authService.user._id) {
        repeat = true;
      }
    }
    return repeat;
  }


  onCommentSubmit() {
    this.commentService.addNewCommentHTTP(this.assembleComment()).subscribe(data => {
      if ((<any>data).success) {
        this.sendComment(JSON.parse((<any>data).comment));
        this.form.reset();
      }
    });
  }

  assembleComment() {
    return {
      text: this.form.get('comment').value,
      createdBy: this.authService.user,
      fanfic: this.readableFanfic._id,
      likes: []
    };
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
