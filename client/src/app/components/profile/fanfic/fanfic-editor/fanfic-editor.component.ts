import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploadComponent } from '../../../file-upload/file-upload.component';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FanficService } from '../../../../services/fanfic.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'fanfic-editor',
  templateUrl: './fanfic-editor.component.html',
  styleUrls: ['./fanfic-editor.component.css']
})
export class FanficEditorComponent implements OnInit{

  @ViewChild(FileUploadComponent) fileUploadComponent;
  froalaOptions: Object = {
    placeholderText: "Fanfic text",
    heightMin: "20vw",
  };

  constructor(
    private  formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficService: FanficService,
    private flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit(): void {
    this.changeVisible(true, false, false);
  }

  toggler (togglable: string) {
    switch(togglable) {
      case "editFanfic": {
        this.changeVisible(false, true, false);
        break;
      }
      case "editChapter": {
        this.changeVisible(false, false, true);
        break;
      }
      case "addChapter": {
        this.changeVisible(true, false, false);
        break;
      }
      default: {
        this.changeVisible(false, false, false);
        break;
      }
    }
  }

  fanficEditorToggle(fanfic) {
    if (this.fanficService.fanficEditorVisible) {
      setTimeout(() => {
        this.changeVisible(true, false, false);
        this.fanficService.fanficEditorVisible = false;
      }, 700)
    } else {
      this.fanficService.currentFanfic = fanfic;
      this.fanficService.fanficEditorVisible = true;
    }
  }

  fanficEditorOpen(fanfic) {
    this.fanficService.currentFanfic = fanfic;
    this.fanficService.fanficEditorVisible = true;
    this.fanficService.newFanficVisible = false;
    this.changeVisible(true, false, false);
}

  changeVisible (addChapter, editFanfic, editChapter) {
    this.fanficService.addChapterVisible = addChapter;
    this.fanficService.editFanficVisible = editFanfic;
    this.fanficService.editChapterVisible = editChapter;
  }

  chapterDelete(chapter) {
    this.fanficService.deleteChapterHTTP(chapter).subscribe(data => {
      if ((<any>data).success) {
        const foundIndex = this.fanficService.currentFanfic.fanficChapters.findIndex(chapterArray => chapterArray._id === chapter._id );
        this.fanficService.currentFanfic.fanficChapters.splice(foundIndex, 1);
        this.flashMessagesService.show('Deleted success', { cssClass: 'alert-success'});
      } else {
        this.flashMessagesService.show('Error', { cssClass: 'alert-danger'});
      }
    });
    setTimeout(() => {
      this.fanficService.editChapterVisible = false
    }, 700)
  }

}
