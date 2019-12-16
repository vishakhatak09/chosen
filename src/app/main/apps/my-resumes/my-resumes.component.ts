import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { MyResumesService } from './my-resumes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MyResumesModel } from 'core/models/resumebuilder.model';
import { AppConstant } from 'core/constants/app.constant';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/main/pages/common-components/confirmation/confirmation.component';
import { PreviewComponent } from 'app/main/pages/common-components/preview/preview.component';
import { JobModel } from 'core/models/job.model';
import { ToastrService } from 'core/services/toastr.service';

@Component({
  selector: 'app-my-resumes',
  templateUrl: './my-resumes.component.html',
  styleUrls: ['./my-resumes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyResumesComponent implements OnInit, OnDestroy {

  resumeGetUrl = environment.serverBaseUrl + 'api/resume/profileResumeList';
  resumeDeleteUrl = environment.serverBaseUrl + 'api/resume/deleteResume';
  sendResumeMail = environment.serverBaseUrl + 'api/resume/sentMail';
  public imageBaseUrl = AppConstant.GeneralConst.UserImagePath;
  public resumeList: MyResumesModel[] = [];

  // private
  private _unsubscribeAll: Subject<any> = new Subject();
  chooseResume: boolean;
  jobDetail: JobModel;

  // profileResumeList
  constructor(
    private router: Router,
    private myResumeService: MyResumesService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    const functionality = this.activatedRoute.snapshot.paramMap.get('choose');
    this.jobDetail = window.history.state['jobDetail'];
    window.history.state['jobDetail'] = null;
    // console.log(functionality);
    if (functionality && functionality === 'choose' && this.jobDetail) {
      this.chooseResume = true;
    }
  }

  ngOnInit() {
    this.getMyResumeList();
  }

  getMyResumeList(): void {

    this.myResumeService.getMyResumes(this.resumeGetUrl)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // console.log(response);
          if (response.data) {
            this.resumeList = response.data;
          }
        },
        (err) => {
          // console.log(err);
        }
      );

  }

  onDelete(resume: MyResumesModel): void {

    const dialogRef = this.matDialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          msg: 'Are you sure you want to delete this resume ?'
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
              resumeId: resume._id,
            }
          };
          this.myResumeService.deleteResume(this.resumeDeleteUrl, params)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              (response) => {
                if (response.code === 200) {
                  this.getMyResumeList();
                }
              },
              error => {
                // console.log(error);
              }
            );
        }
      }
    );

  }

  editResume(resume: MyResumesModel): void {
    this.router.navigate(['/user/' + resume.templateId + '/resumebuilder/' + resume._id]);
  }

  previewImage(template: MyResumesModel): void {
    this.matDialog.open(PreviewComponent, {
      data: {
        image: this.imageBaseUrl + template.resumeImage
      },
      width: 'auto',
      height: '100%',
    });
  }

  chooseResumeForJob(resume: MyResumesModel): void {
    if (resume && this.jobDetail) {
      const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          msg: 'Are you sure you want to choose this resume for job applicaton ?',
        },
        id: 'confirmation-dialog'
      });
      dialogRef.afterClosed().subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          const params = {
            'params': {
              'resumeId': resume._id,
              'email': 'vishakha.tak@outlook.com',
              'jobId': '5df6558719342775a973190b'
            }
          };
          this.myResumeService.chooseSendEmail(this.sendResumeMail, params)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              (response) => {
                if (response.code === 200) {
                  this.toastrService.displaySnackBar(
                    'Job application mail has been sent with your selected resume successfully',
                    'success'
                  );
                  this.router.navigate(['/user/templates']);
                }
              },
              (err) => {
                // console.log(err);
              }
            );
        } else {
          this.chooseResume = false;
          this.jobDetail = null;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
