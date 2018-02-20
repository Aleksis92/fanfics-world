import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource, SelectionModel} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FlashMessagesService } from 'angular2-flash-messages';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { DeleteUserDialogComponent} from './delete-user-dialog/delete-user-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { BlockUserDialogComponent } from './block-user-dialog/block-user-dialog.component';
import {RoleUserDialogComponent} from './role-user-dialog/role-user-dialog.component';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  allUsers: UserService;

  displayedColumns = ['select', '_id', 'username', 'photo', 'role', 'provider', 'status'];
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
    private flashMessagesService: FlashMessagesService,
  ) {
    this.toggleListener();
  }

  ngOnInit() {
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
    this.selection.clear();
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
    this.allUsers = new UserService(this.httpClient, this.authService);
    this.dataSource = new UserDataSource(this.allUsers, this.paginator, this.sort);
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

  deleteUsers() {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {users: this.selection.selected}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const selectedUser = this.selection.selected;
        this.userService.deleteDatabaseUsers(selectedUser).subscribe(data => {
          this.displayUsersDelete(data, selectedUser)
        })
      }
    })
  }

  changeBlockStatus() {
    const dialogRef = this.dialog.open(BlockUserDialogComponent, {
      data: {users: this.selection.selected}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const selectedUser = this.selection.selected;
        const status = this.userService.getDialogData().status;
        this.userService.changeDatabaseBlockUsers(selectedUser, status).subscribe(data => {
          this.displayUsersBlock(data, selectedUser, status)
        })
      }
    })
  }

  changeUsersRole() {
    const dialogRef = this.dialog.open(RoleUserDialogComponent, {
      data: {users: this.selection.selected}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const selectedUser = this.selection.selected;
        const role = this.userService.getDialogData().role;
        this.userService.changeDatabaseUsersRole(selectedUser, role).subscribe(data => {
          this.displayUsersRole(data, selectedUser, role)
        })
      }
    })
  }

  displayUsersBlock(data, selectedUser, status) {
    if(data.success) {
      this.blockUsersIterator(selectedUser, status);
      this.refreshTableMessanger('Selected users successful ' + status.toLowerCase() + 'ed', "alert-success")
    } else {
      this.refreshTableMessanger('Error', 'alert-danger')
    }
  }

  displayUsersDelete(data, selectedUser) {
    if(data.success) {
      this.deleteUsersIterator(selectedUser);
      this.refreshTableMessanger('Selected users successful deleted', "alert-success")
    } else {
      this.refreshTableMessanger('Error', 'alert-danger')
    }
  }

  displayUsersRole(data, selectedUser, role) {
    if(data.success) {
      this.changeUsersIterator(selectedUser, role);
      this.refreshTableMessanger('Selected users role successful changed to  ' + role.toLowerCase(), "alert-success")
    } else {
      this.refreshTableMessanger('Error', 'alert-danger')
    }
  }

  refreshTableMessanger(message: string, cssClass : string) {
    this.refreshTable();
    this.flashMessagesService.show(message, { cssClass: cssClass});
  }

  blockUsersIterator(selectedUser, status) {
    for (let user of selectedUser) {
      const foundIndex = this.allUsers.dataChange.value.findIndex(users => users._id === user._id);
      this.allUsers.dataChange.value[foundIndex].status = status;
    }
  }

  deleteUsersIterator(selectedUser) {
    for (let user of selectedUser) {
      const foundIndex = this.allUsers.dataChange.value.findIndex(users => users._id === user._id);
      this.allUsers.dataChange.value.splice(foundIndex, 1);
    }
  }

  changeUsersIterator(selectedUser, role) {
    for (let user of selectedUser) {
      const foundIndex = this.allUsers.dataChange.value.findIndex(users => users._id === user._id);
      this.allUsers.dataChange.value[foundIndex].role = role;
    }
  }

  toggleListener() {
    this.selection.onChange.subscribe((changeFanfics) => {
      if (changeFanfics.added[0])   // will be undefined if no selection
      {
        this.authService._id = (<any>this.selection.selected[0])._id;
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

    this._allUserFanfic.getAllUsers();

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
        case '_id': [propertyA, propertyB] = [a._id, b._id]; break;
        case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'photo': [propertyA, propertyB] = [a.photo, b.photo]; break;
        case 'role': [propertyA, propertyB] = [a.role, b.role]; break;
        case 'provider': [propertyA, propertyB] = [a.provider, b.provider]; break;
        case 'status': [propertyA, propertyB] = [a.provider, b.provider]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}




