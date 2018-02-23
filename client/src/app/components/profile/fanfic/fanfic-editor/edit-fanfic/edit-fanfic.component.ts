import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../../../services/auth.service';
import {FileUploadComponent} from '../../../../file-upload/file-upload.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FanficService} from '../../../../../services/fanfic.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'edit-fanfic',
  templateUrl: './edit-fanfic.component.html',
  styleUrls: ['./edit-fanfic.component.css']
})
export class EditFanficComponent implements OnInit, OnDestroy {

  autocompleteItems = [];
  tagsObject = [];
  tagCloudModify = [];

  @ViewChild(FileUploadComponent) fileUploadComponent;
  editFanficForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficService: FanficService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.fanficService.coverRefresh = false;
    this.createEditFanficForm()
  }

  ngOnInit() {
    this.fanficService.getCloudTagsHTTP();
    this.tagsObject = this.fanficService.currentFanfic.tags;
    this.tagCloudModify = [];
  }

  ngOnDestroy(): void {
    this.fanficService.editFanficVisible = false;
  }

  createEditFanficForm() {
    this.editFanficForm = this.formBuilder.group({
      title: [this.fanficService.currentFanfic.title],
      description: [this.fanficService.currentFanfic.description],
      cover: [this.fanficService.currentFanfic.cover],
      genre: [this.fanficService.currentFanfic.genre],
      tags: [['tag'], []],
    })
  }

  onEditFanficSubmit() {
    const tags = [];
    for (let tag of this.editFanficForm.get('tags').value) {
      tags.push({name: tag.value})
    }
    this.updateFanfic(this.editTitleFormBuild(tags));
  }

  updateFanfic(fanficTitle) {
    setTimeout(() => {
      this.fanficService.editFanficVisible = false;
    }, 700);
    this.fanficService.modifyCloudTagHTTP(this.tagCloudModify);
    this.tagCloudModify = [];
    this.fanficService.updateFanficTitleHTTP(fanficTitle).subscribe(data => {
      this.updateFanficHttp(data)
    });
  }

  checkRefreshCover() {
    if(this.fanficService.coverRefresh) {
      return this.fileUploadComponent.downloadURL.value;
    } else {
      return this.fanficService.currentFanfic.cover
    }
  }

  updateFanficHttp(data) {
    if (!(<any>data).success) {
      this.flashMessagesService.show('Error', {cssClass: 'alert-danger'})
    } else {
      this.flashMessagesService.show('Selected fanfic successful updated', {cssClass: 'alert-success'});
      this.fanficService.editFanfic.next(JSON.parse((<any>data).fanfic))
    }
  }

  editTitleFormBuild(tags) {
    return {
      _id: this.fanficService.currentFanfic._id,
      title: this.editFanficForm.get('title').value,
      description: this.editFanficForm.get('description').value,
      cover: this.checkRefreshCover(),
      genre: this.editFanficForm.get('genre').value,
      tags: this.editFanficForm.get('tags').value,
      createdBy: this.authService.user._id,
      fanficChapters: this.fanficService.currentFanfic.fanficChapters
    };
  }

  onTagAdd(tag) {
    tag.action = 'add';
    tag.fanfic = this.fanficService.currentFanfic._id;
    this.tagCloudModify.push(tag);
    console.log(this.tagCloudModify)
  }

  onTagRemove(tag) {
    if(this.tagsObject.indexOf(tag) == -1)
    this.tagCloudModify.splice(this.tagCloudModify.indexOf(tag),1)
    else {
      tag.action = 'remove';
      tag.fanfic = this.fanficService.currentFanfic._id;
      this.tagCloudModify.push(tag)
    }
  }

}
