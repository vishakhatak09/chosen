import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User, USERS } from '../users/userlist/list';
import { environment } from 'environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../pages/common-components/confirmation/confirmation.component';
import { fuseAnimations } from '@fuse/animations';
import { JobModel } from 'core/models/job.model';
import { JobMgmtService } from './job-mgmt.service';

@Component({
  selector: 'job-mgmt',
  templateUrl: './job-mgmt.component.html',
  styleUrls: ['./job-mgmt.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class JobMgmtComponent implements OnInit {

  dataSource: MatTableDataSource<JobModel> = new MatTableDataSource([]);
  jobDataList: JobModel[] = [];

  public getJobDataApiUrl = environment.serverBaseUrl + 'admin/job/get';
  public deleteJobApiUrl = environment.serverBaseUrl + 'admin/job/delete';

  displayedColumns = ['title', 'description', 'company', 'location', 'time', 'jobType', 'action'];

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
    private jobService: JobMgmtService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    // this.initSearch();
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

  initDataTable(data: JobModel[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers(): void {

    this.jobService.getJobList(this.getJobDataApiUrl)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        data => {
          console.log('jobdata', data);
          this.initDataTable(this.jobDataList);
        },
        error => {
          console.log(error);
        }
      );

  }

  onDelete(user: User): void {

    const dialogRef = this.matDialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          msg: 'Are you sure you want to delete this job data ?'
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
              id: user._id
            }
          };

          this.jobService.deleteJob(this.deleteJobApiUrl, param)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              data => {
                this.getUsers();
              },
              error => {
                console.log(error);
              }
            );

        }
      }
    );

  }

}
