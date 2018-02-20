import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FanficService} from '../../../../../services/fanfic.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {FileUploadComponent} from '../../../../file-upload/file-upload.component';

@Component({
  selector: 'edit-chapter',
  templateUrl: './edit-chapter.component.html',
  styleUrls: ['./edit-chapter.component.css']
})
export class EditChapterComponent implements OnInit {


  @ViewChild(FileUploadComponent) fileUploadComponent;
  editChapterForm: FormGroup;
  froalaOptions: Object = {
    placeholderText: "Fanfic text",
    heightMin: "15vw",
    heightMax: "50vw",
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficService: FanficService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.fanficService.coverRefresh = false;
    this.fanficService.currentChapter = this.fanficService.currentFanfic.fanficChapters[0];
    this.createEditChapterForm();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.fanficService.editChapterVisible = false;
    this.fanficService.currentChapter = false;
  }

  createEditChapterForm() {
    this.editChapterForm = this.formBuilder.group({
      title: [this.fanficService.currentChapter.title],
      chapter: [this.fanficService.currentChapter.chapter],
      cover: [this.fanficService.currentChapter.cover]
    })
  }

  showSelectChapter(_id) {
    this.fanficService.currentChapter = this.fanficService.currentFanfic.fanficChapters.find(chapter => chapter._id == _id)
    this.editChapterForm.controls.chapter.setValue(this.fanficService.currentChapter.chapter)
  }

  onEditChapterSubmit() {
    setTimeout(() => {
      this.fanficService.editChapterVisible = false;
    }, 700);
    this.editChapter();

  }

  editChapter() {
    this.fanficService.editFanficChapter(this.assemblyChapter()).subscribe(data => {
      if ((<any>data).message !== "success") {
        this.flashMessagesService.show('Error', {cssClass: 'alert-danger'})
      } else {
        this.flashMessagesService.show('Fanfic chapter successful edited', {cssClass: 'alert-success'});
        console.log(JSON.parse((<any>data).chapter))
        this.fanficService.editChapter.next(JSON.parse((<any>data).chapter))
      }
    })
  }

  assemblyChapter () {
    const chapter = {
      _id: this.fanficService.currentChapter._id,
      title: this.editChapterForm.get('title').value,
      chapter: this.editChapterForm.get('chapter').value,
      cover: this.checkRefreshCover(),
      fanficId: this.fanficService.currentFanfic._id
    };
    return chapter
  }

  checkRefreshCover() {
    if(this.fanficService.coverRefresh) {
      return this.fileUploadComponent.downloadURL.value;
    } else {
      return this.fanficService.currentChapter.cover
    }
  }

}
