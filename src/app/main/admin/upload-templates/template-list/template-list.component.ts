import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ConfirmationDialogComponent } from 'app/main/pages/common-components/confirmation/confirmation.component';
import { environment } from 'environments/environment';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { User } from '../../users/userlist/list';
import { TemplateListService } from './template-list.service';
import { Router } from '@angular/router';
import { AdminTemplateModel } from 'core/models/admin-template.model';
import { PreviewComponent } from 'app/main/pages/common-components/preview/preview.component';
import { AppConstant } from 'core/constants/app.constant';
import { ToastrService } from 'core/services/toastr.service';

@Component({
  selector: 'template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TemplateListComponent implements OnInit, OnDestroy {

  public baseUrl = AppConstant.GeneralConst.TemplateBasePath;
  public getTemplateUrl = environment.serverBaseUrl + 'admin/template/templateList';
  public deleteTemplateUrl = environment.serverBaseUrl + 'admin/template/deleteTemplate';

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  templateList: AdminTemplateModel[] = [];
  displayedColumns = ['image', 'title', 'description', 'action'];

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
   **/
  constructor(
    private matDialog: MatDialog,
    private templateService: TemplateListService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    // this.initSearch();
    this.getTemplateList();

  }

  initDataTable(data): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onDelete(user: AdminTemplateModel): void {

    const dialogRef = this.matDialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          msg: 'Are you sure you want to delete this template ?'
        },
        width: 'auto',
        height: 'auto',
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe(
      (confirmation) => {
        if (confirmation === true) {
          const params = {
            params: {
              templateId: user._id,
            }
          };
          this.templateService.deleteTemplate(this.deleteTemplateUrl, params)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              (response) => {
                if (response.code === 200) {
                  this.getTemplateList();
                }
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

  getTemplateList(): void {

    this.templateService.getTemplates(this.getTemplateUrl)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          if (response.data) {
            this.templateList = response.data;
          }
          this.initDataTable(this.templateList);
        },
        (err) => {
          // console.log(err);
          this.toastrService.displaySnackBar('No Templates available', 'error');
        }
      );

  }

  onEdit(template: AdminTemplateModel): void {
    this.router.navigate(['/ad/' + template._id + '/upload-template']);
  }

  previewImage(template: AdminTemplateModel): void {
    this.matDialog.open(PreviewComponent, {
      data: {
        image: this.baseUrl + template.image
      },
      width: 'auto',
      height: '100%',
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
