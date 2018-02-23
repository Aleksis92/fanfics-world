import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadComponent } from '../../../file-upload/file-upload.component';
import { FanficService } from '../../../../services/fanfic.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'new-fanfic',
  templateUrl: './new-fanfic.component.html',
  styleUrls: ['./new-fanfic.component.css']
})
export class NewFanficComponent implements OnInit {

  autocompleteItems = [];
  tagCloudModify = [];

  @ViewChild(FileUploadComponent) fileUploadComponent;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficService: FanficService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.fanficService.getCloudTagsHTTP();
    this.tagCloudModify = [];
    this.fanficService.coverRefresh = false;
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      cover: [''],
      genre: ['Movie'],
      tags: [['tag'], []],
    })
  }

  onNewFanficSubmit() {
    this.saveFanfic(this.titleFormBuild())
  }

  saveFanfic(fanficTitle) {
    this.fanficService.newFanficToggle();
    fanficTitle.tagCloud = this.tagCloudModify;
    this.tagCloudModify = [];
    this.fanficService.createFanficTitleHTTP(fanficTitle).subscribe(data => {
      this.addFanficHTTP(data);
    });
  }

  titleFormBuild() {
    return {
      title: this.form.get('title').value,
      description: this.form.get('description').value,
      cover: this.fileUploadComponent.downloadURL.value,
      genre: this.form.get('genre').value,
      tags: this.form.get('tags').value,
      createdBy: this.authService.user
    };
  }

  addFanficHTTP(data) {
    if (!(<any>data).success) {
      this.flashMessagesService.show('Error', {cssClass: 'alert-danger'})
    } else {
      this.flashMessagesService.show('New fanfic successful added', {cssClass: 'alert-success'});
      this.fanficService.newFanfic.next(JSON.parse((<any>data).fanfic))
    }
  }

  onTagAdd(tag) {
    tag.action = 'add';
    this.tagCloudModify.push(tag)
  }

  onTagRemove(tag) {
    this.tagCloudModify.splice(this.tagCloudModify.indexOf(tag),1)
  }

}
