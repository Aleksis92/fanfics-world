import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadComponent } from '../../../file-upload/file-upload.component';
import { FanficService } from '../../../../services/fanfic.service';


@Component({
  selector: 'new-fanfic',
  templateUrl: './new-fanfic.component.html',
  styleUrls: ['./new-fanfic.component.css']
})
export class NewFanficComponent implements OnInit {

  newFanfic = false;
  @ViewChild(FileUploadComponent) fileUploadComponent;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficService: FanficService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      cover: ['', Validators.required],
      genre: ['Movie', Validators.required],
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
      //fanfic: this.form.get('fanfic').value
    };
    this.fanficService.newFanficToggle();
    this.fanficService.createFanficTitle(fanficTitle);
  }
}
