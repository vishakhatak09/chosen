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
import { JobDetailComponent } from 'app/main/apps/job-detail/job-detail.component';

@Component({
  selector: 'job-mgmt',
  templateUrl: './job-mgmt.component.html',
  styleUrls: ['./job-mgmt.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class JobMgmtComponent implements OnInit {

  dataSource: MatTableDataSource<any[]> = new MatTableDataSource([]);
  jobDataList: any[] = [];

  public getJobDataApiUrl = environment.serverBaseUrl + 'admin/job/jobList';
  public deleteJobApiUrl = environment.serverBaseUrl + 'admin/job/deleteJob';

  displayedColumns = ['jobPosition', 'companyName', 'location', 'action'];

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
    private jobService: JobMgmtService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    // this.initSearch();
    this.getUsers();
    // this.initDataTable(this.jobDataList);

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

  initDataTable(data: any[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers(): void {

    this.jobService.getJobList(this.getJobDataApiUrl)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        data => {
          this.jobDataList = data.data;
          this.initDataTable(this.jobDataList);
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
              jobId: user._id
            }
          };

          this.jobService.deleteJob(this.deleteJobApiUrl, param)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              data => {
                this.getUsers();
              },
              error => {
                // console.log(error);
              }
            );

        }
      }
    );

  }

}
