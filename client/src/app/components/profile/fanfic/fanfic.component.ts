import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FanficService } from '../../../services/fanfic.service';
import { AuthService } from '../../../services/auth.service';
import { UserFanfics } from '../../../models/user-fanfics';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'fanfic',
  templateUrl: './fanfic.component.html',
  styleUrls: ['./fanfic.component.css']
})

export class FanficComponent implements OnInit, OnDestroy {

  allUserFanfics: FanficService;

  displayedColumns = ['actions', 'title', 'description', 'cover', 'genre', 'tags', 'chaptersCount', 'updatedAt'];
  selection = new SelectionModel<UserFanfics>(true, []);
  dataSource: FanficDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private fanficService: FanficService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private flashMessagesService: FlashMessagesService
  ) {
  }

  ngOnInit() {
    this.loadData();
    Promise.resolve().then(() => this.newFanficListener());
    Promise.resolve().then( () => this.editFanficListener());
    this.editChapterListener()
  }

  refresh() {
    this.loadData();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  private refreshTable() {
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }
  }

  public loadData() {
    this.allUserFanfics = new FanficService(this.httpClient, this.authService, this.translate, this.flashMessagesService);
    this.dataSource = new FanficDataSource(this.allUserFanfics, this.paginator, this.sort, this.authService);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  newFanficListener() {
    this.fanficService.newFanfic.subscribe(data => {
      if (data) {
        this.allUserFanfics.dataChange.value.push(<any>data);
        this.refreshTable();
      }
    })
  }

  editFanficListener() {
    this.fanficService.editFanfic.subscribe(data => {
      if (data) {
        const foundIndex = this.allUserFanfics.dataChange.value.findIndex(users => users._id === this.fanficService.currentFanfic._id);
        this.allUserFanfics.dataChange.value[foundIndex] = <any>data;
        this.allUserFanfics.dataChange.value[foundIndex].chaptersCount = (<any>data).fanficChapters.length;
        this.fanficService.currentFanfic = <any>data;
        this.refreshTable();
      }
    })
  }

  editChapterListener() {
    this.fanficService.editChapter.subscribe(data => {
      if (data) {
        const fanficIndex = this.allUserFanfics.dataChange.value.findIndex(users => users._id === this.fanficService.currentFanfic._id);
        const chapterIndex = (<any>this.allUserFanfics.dataChange.value[fanficIndex]).fanficChapters.findIndex(users => users._id === this.fanficService.currentChapter._id);
        (<any>this.allUserFanfics.dataChange.value[fanficIndex]).fanficChapters[chapterIndex] = data;
        this.fanficService.currentFanfic = this.allUserFanfics.dataChange.value[fanficIndex];
        this.refreshTable();
      }
    })
  }

  deleteFanfic(fanfic) {
    this.fanficService.deleteFanficHTTP(fanfic).subscribe(data => {
      if ((<any>data).success) {
      const foundIndex = this.allUserFanfics.dataChange.value.findIndex(users => users._id === fanfic._id);
      this.allUserFanfics.dataChange.value.splice(foundIndex, 1);
      this.refreshTableMessanger('Deleted success', 'alert-success')
      } else {
        this.refreshTableMessanger('Error', 'alert-fanger')
      }
    })
  }

  refreshTableMessanger(message: string, cssClass : string) {
    this.refreshTable();
    this.flashMessagesService.show(message, { cssClass: cssClass});
  }

  ngOnDestroy(): void {
    this.fanficService.fanficEditorVisible = false;
  }

}

export class FanficDataSource extends DataSource<UserFanfics> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: UserFanfics[] = [];
  renderedData: UserFanfics[] = [];

  constructor(public _allUserFanfic: FanficService,
              public _paginator: MatPaginator,
              public _sort: MatSort,
              public _authService: AuthService) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserFanfics[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._allUserFanfic.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._allUserFanfic.getAllUserFanfics(this._authService.user);

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._allUserFanfic.data.slice().filter((userFanfic: UserFanfics) => {
        const searchStr = (userFanfic.title + userFanfic.description + userFanfic.genre + userFanfic.tags + userFanfic.chaptersCount).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }
  disconnect() {
  }



  /** Returns a sorted copy of the database data. */
  sortData(data: UserFanfics[]): UserFanfics[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'title': [propertyA, propertyB] = [a.title, b.title]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
        case 'cover': [propertyA, propertyB] = [a.cover, b.cover]; break;
        case 'genre': [propertyA, propertyB] = [a.genre, b.genre]; break;
        case 'tags': [propertyA, propertyB] = [a.tags, b.tags]; break;
        case 'chaptersCount': [propertyA, propertyB] = [a.chaptersCount, b.chaptersCount]; break;
        case 'updatedAt': [propertyA, propertyB] = [a.updatedAt, b.updatedAt]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}



