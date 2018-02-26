import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource, SelectionModel} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { AddFanficDialogComponent } from './add-fanfic-dialog/add-fanfic-dialog.component';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class PanelComponent implements OnInit {

  allUserFanfics: UserService;

  displayedColumns = ['select', '_id', 'username', 'photo', 'role', 'provider'];
  selection = new SelectionModel<User>(true, []);
  dataSource: UserDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.toggleListener();
    this.NewFanficListener();
  }

  ngOnInit() {
    this.authService.loadToken();
    this.loadData();
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
    this.allUserFanfics = new UserService(this.httpClient, this.authService);
    this.dataSource = new UserDataSource(this.allUserFanfics, this.paginator, this.sort);
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

  toggleListener() {
    this.selection.onChange.subscribe((changeFanfics) => {
      if (changeFanfics.added[0])   // will be undefined if no selection
      {
        console.log(this.selection.selected)
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource._allUserFanfic.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource._allUserFanfic.data.forEach(row => this.selection.select(row));
  }

  addFanfic(userFanfic: User) {
    const dialogRef = this.dialog.open(AddFanficDialogComponent, {
      data: {userFanfic: userFanfic }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.allUserFanfics.dataChange.value.push(this.userService.getDialogData());
        this.refreshTable();
      }
    });
  }

  NewFanficListener() {
    this.userService.newFanfic.subscribe(data => {
      if (data) {

        this.allUserFanfics.dataChange.value.push(<any>data);
        this.refreshTable();
      }
    })
  }
}

export class UserDataSource extends DataSource<User> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: User[] = [];
  renderedData: User[] = [];

  constructor(public _allUserFanfic: UserService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._allUserFanfic.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._allUserFanfic.getAllUserFanfics();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._allUserFanfic.data.slice().filter((user: User) => {
        const searchStr = (user._id + user.username + user.provider + user.role).toLowerCase();
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
  sortData(data: User[]): User[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'title': [propertyA, propertyB] = [a._id, b._id]; break;
        case 'description': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'cover': [propertyA, propertyB] = [a.photo, b.photo]; break;
        case 'genre': [propertyA, propertyB] = [a.role, b.role]; break;
        case 'tags': [propertyA, propertyB] = [a.provider, b.provider]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}




