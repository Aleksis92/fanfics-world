import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadComponent } from '../../../file-upload/file-upload.component';
import { FanficService } from '../../../../services/fanfic.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'new-fanfic',
  templateUrl: './new-fanfic.component.html',
  styleUrls: ['./new-fanfic.component.css']
})
export class NewFanficComponent implements OnInit {

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
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      cover: [''],
      genre: ['Movie'],
      tags: ['', Validators.required],
      //fanfic: ['', Validators.required]
    })
  }

  onNewFanficSubmit() {
    const fanficTitle = {
      title: this.form.get('title').value,
      description: this.form.get('description').value,
      cover: this.fileUploadComponent.downloadURL.value,
      genre: this.form.get('genre').value,
      tags: this.form.get('tags').value,
      createdBy: this.authService.user
      //fanfic: this.form.get('fanfic').value
    };
    this.saveFanfic(fanficTitle)
  }

  saveFanfic(fanficTitle) {
    this.fanficService.newFanficToggle();
    this.fanficService.createFanficTitle(fanficTitle).subscribe(data => {
      if ((<any>data).message !== "success") {
        this.flashMessagesService.show('Error', {cssClass: 'alert-danger'})
      } else {
        this.flashMessagesService.show('New fanfic successful added', {cssClass: 'alert-success'});
        this.fanficService.newFanfic.next(JSON.parse((<any>data).fanfic))
      }
    });
  }
}
