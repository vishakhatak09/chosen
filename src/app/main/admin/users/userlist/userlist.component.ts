import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { User } from './list';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/main/pages/common-components/confirmation/confirmation.component';
import { UserListService } from './userlist.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'core/services/toastr.service';
import { AppConstant } from 'core/constants/app.constant';

@Component({
  selector: 'userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserlistComponent implements OnInit {

  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);
  // userList: User[] = USERS;
  userList: User[] = [];

  public getUserApiUrl = environment.serverBaseUrl + 'admin/user/userList';
  public deleteUserApiUrl = environment.serverBaseUrl + 'admin/user/deleteUser';

  displayedColumns = ['_id', 'name', 'email',
    'type',
    // 'resumes',
    // 'payment',
    'currentJobLocation',
    'preferredJobLocation',
    'status',
    'action'];

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   */
  constructor(
    private matDialog: MatDialog,
    private userService: UserListService,
    private toastrService: ToastrService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    // this.initDataTable(this.userList);
    this.initSearch();
    this.getUsers();

  }

  initSearch(): void {
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  initDataTable(data: User[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  sortingDataAccessor(item: any, property: string) {
    if (property === 'currentJobLocation' || property === 'preferredJobLocation') {
      if ( item.resume && item.resume.personalInfo && item.resume.personalInfo[property] ) {
        return item.resume.personalInfo[property];
      }
    }
    return item[property];
  }

  getUsers(): void {

    this.userService.getUsersList(this.getUserApiUrl)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        response => {
          // console.log('userdata', response);
          if (response.code === 200 && response.data) {
            this.userList = response.data;
          }
          this.initDataTable(this.userList);
        },
        error => {
          // console.log(error);
        }
      );

  }

  onDelete(user: User): void {

    const dialogRef = this.matDialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          msg: 'Are you sure you want to delete this user ?'
        },
        width: 'auto',
        height: 'auto',
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe(
      (confirmation) => {
        if (confirmation === true) {

          const param = {
            params: {
              userId: user._id
            }
          };

          this.userService.deleteUser(this.deleteUserApiUrl, param)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              data => {
                this.getUsers();
              },
              error => {
                // console.log(error);
                this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.somethingWentWrong, 'error');
              }
            );

        }
      }
    );

  }

}
