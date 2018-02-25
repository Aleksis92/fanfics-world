import {Component, OnInit} from '@angular/core';
import {CloudData, CloudOptions} from 'angular-tag-cloud-module';
import {FanficService} from '../../../services/fanfic.service';

@Component({
  selector: 'cloud-tags',
  templateUrl: './cloud-tags.component.html',
  styleUrls: ['./cloud-tags.component.css']
})
export class CloudTagsComponent implements OnInit {

  tagList;
  searchLink = 'http://localhost:3000/search/tag/';
  options: CloudOptions = {
    width: 400,
    height: 400,
    overflow: true,
  };

  constructor(private fanficService: FanficService) {
    this.getAllTags();
  }

  ngOnInit() {

  }

  getAllTags() {
    this.fanficService.getAllTagsHTTP().subscribe(data => {
      if ((<any>data).success) {
        this.tagList = JSON.parse((<any>data).tags);
      } else {
        console.log('CloudTagError');
      }
    });
  }

}
