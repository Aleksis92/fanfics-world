import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../services/auth.service';
import {FanficService} from '../../../../../services/fanfic.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {FileUploadComponent} from '../../../../file-upload/file-upload.component';

@Component({
  selector: 'add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.css']
})
export class AddChapterComponent implements OnInit, OnDestroy {

  @ViewChild(FileUploadComponent) fileUploadComponent;
  addChapterForm: FormGroup;
  froalaOptions: Object = {
    placeholderText: "Fanfic text",
    heightMin: "15vw",
    heightMax: "50vw",
  };

  constructor(
    private  formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficService: FanficService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.createAddChapterForm();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.fanficService.addChapterVisible = false;
  }

  createAddChapterForm() {
    this.addChapterForm = this.formBuilder.group({
      title: ['', Validators.required],
      chapter: [''],
      cover: ['']
    })
  }

  onAddChapterSubmit() {
    let chapter: any = {};
      chapter.title = this.addChapterForm.get('title').value;
      chapter.chapter = this.addChapterForm.get('chapter').value;
      chapter.fanficId = this.fanficService.currentFanfic._id;
    if(this.fileUploadComponent.downloadURL) {
      chapter.cover = this.fileUploadComponent.downloadURL.value
    }
    console.log(chapter)
    this.addChapter(chapter)
  }

  addChapter(chapter) {
    setTimeout(() => {
      this.fanficService.addChapterVisible = false;
    }, 700);
    this.fanficService.addFanficChapter(chapter).subscribe(data => {
      if ((<any>data).message !== "success") {
        this.flashMessagesService.show('Error', {cssClass: 'alert-danger'})
      } else {
        this.flashMessagesService.show('Successful added new chapter', {cssClass: 'alert-success'});
        this.fanficService.editFanfic.next(JSON.parse((<any>data).fanfic))
      }
    })
  }

}
