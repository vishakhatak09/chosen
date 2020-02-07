import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'core/services/toastr.service';
import { AppConstant } from 'core/constants/app.constant';
import { takeUntil } from 'rxjs/operators';
import 'tinymce/tinymce.min.js';
declare var tinymce: any;
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-job-email',
  templateUrl: './job-email.component.html',
  styleUrls: ['./job-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class JobEmailComponent implements OnInit, OnDestroy {
  tinyEditorConfig = {};

  setEmailForm: FormGroup;
  jobStateData;
  sendResumeMail = environment.serverBaseUrl + 'api/resume/sentMail';
  uploadFile = false;
  selectedFile: File;


  // private
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {
    this.jobStateData = window.history.state['jobData'];
    window.history.state['jobData'] = null;
   }

  ngOnInit() {
    this.setEmailForm = this.fb.group({
      to: ['', Validators.required],
      from: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });

    this.setupTinyMce();
    // console.log('this.jobStateData', this.jobStateData);
    if (this.jobStateData && this.jobStateData.job) {
      this.setEmailForm.get('to').setValue(this.jobStateData.job.email);
      this.setEmailForm.get('to').disable();
      this.setEmailForm.get('from').disable();
      this.setEmailForm.get('subject').setValue('Job Application for ' + this.jobStateData.job.jobPosition);
      this.setEmailForm.get('from').setValue(this.jobStateData.resume.personalInfo.email);
      if ( this.jobStateData.resume._id ) {
        this.uploadFile = true;
      }
    } else {
      this.router.navigate(['/user/job-search']);
    }
  }

  private setupTinyMce(): void {
    // tinymce.baseURL = 'assets'; // Need to display proper editor with its its folder in assets folder
    tinymce.baseURL = environment.tinyMceBaseUrl; // Need to display proper editor with its its folder in assets folder
    this.tinyEditorConfig = {
      // selector: 'textarea#editorId',
      // skin_url: '/skins', // Or loaded from your environments config
      suffix: '.min',       // Suffix to use when loading resources
      plugins: 'lists advlist paste',
      statusbar: false,
      browser_spellcheck: true,
      toolbar: 'bold italic underline | bullist numlist |  undo redo',
      height: 300,
      menubar: false,
      header: false,
      paste_as_text: true
    };
    tinymce.init(this.tinyEditorConfig);
  }

  onSubmit() {
    if (this.setEmailForm.valid) {
      const formValue = this.setEmailForm.getRawValue();

      if ( !this.jobStateData.resume._id && !this.selectedFile ) {
        this.toastrService.displaySnackBar('Please upload resume', 'error');
        return;
      }
      // console.log(this.selectedFile);
      const formdata = new FormData();

      // const params: any = {
      //   'params': {
      //     // 'resumeId': this.jobStateData.resume._id,
      //     'toEmail': this.jobStateData.job.email,
      //     'personName': this.jobStateData.resume.personalInfo.firstName + ' ' + (this.jobStateData.resume.personalInfo.lastName || ''),
      //     'fromEmail': this.jobStateData.resume.personalInfo.email,
      //     'jobId': this.jobStateData.job._id,
      //     'jobPosition': this.jobStateData.job.jobPosition,
      //     'subject': formValue.subject,
      //     'mailBody': formValue.body,
      //   }
      // };
      const name = this.jobStateData.resume.personalInfo.firstName + ' ' + (this.jobStateData.resume.personalInfo.lastName || '');
      formdata.append('toEmail', this.jobStateData.job.email);
      formdata.append('personName', name);
      formdata.append('fromEmail', this.jobStateData.resume.personalInfo.email);
      formdata.append('jobId', this.jobStateData.job._id);
      formdata.append('jobPosition', this.jobStateData.job.jobPosition);
      formdata.append('subject', formValue.subject);
      formdata.append('mailBody', formValue.body);
      if ( this.jobStateData.resume._id ) {
        // params.params.resumeId = this.jobStateData.resume._id;
        formdata.append('resumeId', this.jobStateData.resume._id);
        formdata.append('isCustomResume', '0');
      } else {
        // params.params.resume = formdata;
        formdata.append('isCustomResume', '1');
        formdata.append('customResume', this.selectedFile);
      }
      this.httpClient.post<any>(this.sendResumeMail, formdata)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (response) => {
            if (response.code === 200) {
              this.toastrService.displaySnackBar(
                'Job application mail has been sent with your selected resume successfully',
                'success',
                3000
              );
              this.router.navigate(['/user/job-search']);
            }
          },
          (err) => {
            if (err && err.code && err.code === 400 && (err.err && (err.err.code || err.err.code === 'ESTREAM'))) {
              this.toastrService.displaySnackBar('Please fill all your details is selected resume', 'error', 3000);
            } else {
              this.toastrService.displaySnackBar(AppConstant.ConstantMsgs.somethingWentWrong, 'error', 3000);
            }
            this.router.navigate(['/user/job-search']);
          }
        );

    }
  }

  selectFile(files: FileList): void {
    if ( files.length > 0 ) {
      this.selectedFile = files[0];
    } else {
      this.selectedFile = null;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
