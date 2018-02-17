import {Component, OnInit, ViewChild} from '@angular/core';
import {FileUploadComponent} from '../../../file-upload/file-upload.component';
import {AuthService} from '../../../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FanficService} from '../../../../services/fanfic.service';

@Component({
  selector: 'edit-fanfic',
  templateUrl: './edit-fanfic.component.html',
  styleUrls: ['./edit-fanfic.component.css']
})
export class EditFanficComponent implements OnInit {


  editFanfic = false;
  @ViewChild(FileUploadComponent) fileUploadComponent;
  form: FormGroup;
  froalaOptions: Object = {
    placeholderText: "Fanfic text",
  };

  constructor(
    private  formBuilder: FormBuilder,
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
      chapter: ['', Validators.required]
    })
  }

  onAddChapterSubmit() {
    const chapter = {
      title: this.form.get('title').value,
      chapter: this.form.get('chapter').value
    };
    console.log(chapter);
    this.fanficService.addChapter(chapter).subscribe(data => {
      if ((<any>data).message !== "success") {
        console.log('fail')
      } else {
        console.log('success')
      }
    })
  }

}
