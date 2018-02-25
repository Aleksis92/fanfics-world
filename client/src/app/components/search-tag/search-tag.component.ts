import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FanficService} from '../../services/fanfic.service';

@Component({
  selector: 'search-tag',
  templateUrl: './search-tag.component.html',
  styleUrls: ['./search-tag.component.css']
})
export class SearchTagComponent implements OnInit {

  tag;
  searchTagFanfics;

  constructor(private route: ActivatedRoute,
              private fanficService: FanficService,
              private router: Router,) {
  }

  ngOnInit() {
    this.getTagFanfics();
  }

  getTagFanfics() {
    this.tag = this.route.snapshot.params['tag'].replace(':', '');
    this.fanficService.getTagFanficsHTTP(this.tag).subscribe(data => {
      if ((<any>data).success) {
        this.searchTagFanfics = JSON.parse((<any>data).fanfics);
      } else {
        this.fanficService.showFlashMessage('SEARCH.ERROR', 'alert-info');
        this.router.navigate(['/home']);
      }
    });
  }

}
