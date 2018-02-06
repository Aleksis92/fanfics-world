import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private formBuider: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.searchForm = this.formBuider.group({
      search: '',
    });
  }

}
