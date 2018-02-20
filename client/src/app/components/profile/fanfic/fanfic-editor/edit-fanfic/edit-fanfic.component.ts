import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../../../services/auth.service';
import {FileUploadComponent} from '../../../../file-upload/file-upload.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FanficService} from '../../../../../services/fanfic.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'edit-fanfic',
  templateUrl: './edit-fanfic.component.html',
  styleUrls: ['./edit-fanfic.component.css']
})
export class EditFanficComponent implements OnInit, OnDestroy {

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
      tags: [this.fanficService.currentFanfic.tags],
    })
  }

  onEditFanficSubmit() {
    const fanficTitle = {
      _id: this.fanficService.currentFanfic._id,
      title: this.editFanficForm.get('title').value,
      description: this.editFanficForm.get('description').value,
      cover: this.checkRefreshCover(),
      genre: this.editFanficForm.get('genre').value,
      tags: this.editFanficForm.get('tags').value,
      createdBy: this.authService.user._id,
      fanficChapters: this.fanficService.currentFanfic.fanficChapters
    };
    this.updateFanfic(fanficTitle);
  }

  updateFanfic(fanficTitle) {
    setTimeout(() => {
      this.fanficService.editFanficVisible = false;
    }, 700);
    this.fanficService.updateFanficTitle(fanficTitle).subscribe(data => {
      if ((<any>data).message !== "success") {
        this.flashMessagesService.show('Error', {cssClass: 'alert-danger'})
      } else {
        this.flashMessagesService.show('Selected fanfic successful updated', {cssClass: 'alert-success'});
        this.fanficService.newFanfic.next(JSON.parse((<any>data).fanfic))
      }
    });
  }

  checkRefreshCover() {
    if(this.fanficService.coverRefresh) {
      return this.fileUploadComponent.downloadURL.value;
    } else {
      return this.fanficService.currentFanfic.cover
    }
  }

}
