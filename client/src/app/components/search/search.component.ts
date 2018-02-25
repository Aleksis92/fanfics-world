import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FanficService} from '../../services/fanfic.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search;
  searchFanfics;

  constructor(private route: ActivatedRoute,
              private fanficService: FanficService,
              private router: Router,) {
  }

  ngOnInit() {
    this.getTagFanfics();
  }

  getTagFanfics() {
    this.search = this.route.snapshot.params['query'].replace(':', '');
    this.fanficService.getSearchFanficsHTTP(this.search).subscribe(data => {
      if ((<any>data).success) {
        this.searchFanfics = JSON.parse((<any>data).fanfics);
      } else {
        this.fanficService.showFlashMessage('SEARCH.ERROR', 'alert-info');
        this.router.navigate(['/home']);
      }
    });
  }

}
