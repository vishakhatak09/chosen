import { ENTER } from '@angular/cdk/keycodes';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef,
  ViewContainerRef,
  ComponentRef,
  AfterContentInit,
  ComponentFactoryResolver,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatChipInputEvent } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AppConstant, OptionType } from 'core/constants/app.constant';
import {
  AdditionalModel,
  EducationModel,
  SkillRating,
  SocialModel,
  WorkModel,
  MyResumesModel
} from 'core/models/resumebuilder.model';
import { ToastrService } from 'core/services/toastr.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import 'tinymce/tinymce.min.js';
import { ConfirmationDialogComponent } from '../../pages/common-components/confirmation/confirmation.component';
import { AddEducationComponent } from './add-education/add-education.component';
import { AddWorkComponent } from './add-work/add-work.component';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { ResumePreviewComponent } from './resume-preview/resume-preview.component';
import { ResumeBuilderService } from './resumebuilder.service';
import { AuthenticationService } from 'core/services/authentication.service';
declare var tinymce: any;
import * as _ from 'lodash';
import { CommonService } from 'core/services/common.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { exportPDF, Group, exportImage } from '@progress/kendo-drawing';
import { TemplateDynamicDirective } from '@fuse/directives/template-dynamic.directive';
import { ResumeTemplateComponent } from './resume-template/resumetemplate.component';
import { ResumeProfessionalComponent } from './resume-professional/resume-professional.component';
import { LoadingScreenService } from '@fuse/services/loading.service';
import { templateMock } from 'core/mock/temp-content';

@Component({
  selector: 'app-resumebuilder',
  templateUrl: './resumebuilder.component.html',
  styleUrls: ['./resumebuilder.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: AppConstant.DEFAULT_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResumebuilderComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {

  public defaultProfile = environment.baseUrl + 'assets/images/logos/profile.jpg';
  public getEditUrl = environment.serverBaseUrl + 'api/resume/singleResume';
  resumeEditData: MyResumesModel;
  public profileSrc: string | ArrayBuffer;
  public profileFileName: string;
  public basicDetailForm: FormGroup;
  public careerObjForm: FormGroup;
  maxDate = new Date();
  maritalStatusOpts: OptionType[] = AppConstant.MaritalStatusOptions;
  genderOptions: OptionType[] = AppConstant.GenderOptions;
  baseUrl = environment.baseUrl;
  maxRate = 5;
  ratingStyle = 'square';
  skillOptions: OptionType[] = AppConstant.SkillCustomOptions;
  skillRatingList: SkillRating[] = [];
  ratingThemeList: OptionType[] = AppConstant.RatingThemes;
  public imageBaseUrl = AppConstant.GeneralConst.UserImagePath;

  tinyEditorConfig = {};
  workExperienceData: WorkModel[] = [];
  educationData: EducationModel[] = [];
  fontColor = '#fff';
  backColor = '#43a047';
  defaultColor = '#fff';
  public haveAdditionalInfo = false;
  public socialLinkArray: SocialModel[] = [];
  public socialSites: string[] = AppConstant.SocialSites;
  urlPattern = AppConstant.ValidUrlPattern;
  additionalInfoList = AppConstant.AdditionalInfo;
  additionalInfoData: AdditionalModel[] = [];
  allowDownload = false;

  @ViewChild('templateRef', { static: false }) templateContent: ElementRef;
  @ViewChild('pdf', { static: false }) pdfComponent;
  separatorKeysCodes: number[] = [ENTER];
  selectedIndex = 0;
  public MockTemplate: string;
  isLinear = true;
  userEmail: string;
  userName: string;

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();
  skillForm: FormGroup;

  @ViewChild('container', { read: ViewContainerRef, static: false })
  container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;
  public templateId: string;
  public resumeId: string;
  public maxSocialLinks = AppConstant.MaxSocialLinks;

  public resolution = 100;
  public pageSize: string;
  // public pageSize = 'A4';
  private templatePdfFile: File;
  private templateImageBase64: Blob | string;
  public fontFamilyOptions = AppConstant.FontFamilyOptions;
  public selectedFont = 'sans-serif';

  // dynamic template
  public currentTemplate: string;
  @ViewChild(TemplateDynamicDirective, { static: true }) dynamicTemplate: TemplateDynamicDirective;
  isComponentLoaded = false;
  selectedImage: File;
  lastStep: boolean;
  selectedSkillType = false;

  /**
   * Constructor
   * @param _formBuilder FormBuilder
   * @param matDialog MatDialog
   */
  constructor(
    private _formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private resumeBuilderService: ResumeBuilderService,
    private cdRef: ChangeDetectorRef,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderService: LoadingScreenService
  ) {
    this.currentTemplate = localStorage.getItem('selected');
    if (this.activatedRoute.data) {
      this.activatedRoute.data.subscribe((resp) => {
        if (resp.data && resp.data.code === 200 && resp.data.data) {
          this.currentTemplate = resp.data.data.title.toLowerCase();
          // this.loaderService.show();
        }
      });
    }
    this.templateId = this.activatedRoute.snapshot.paramMap.get('templateId');
    this.resumeId = this.activatedRoute.snapshot.paramMap.get('resumeId');
    this.additionalInfoList.filter((add) => add.checked = false);
    if (this.resumeId) {
      this.getResumeData(this.resumeId);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {

    this.basicDetailForm = this._formBuilder.group({
      firstName: [undefined, [Validators.required]],
      lastName: [undefined, [Validators.required]],
      contactNumber: [undefined, [Validators.required, Validators.pattern(AppConstant.ValidPhonePattern)]],
      // email: ['', [Validators.required, Validators.email]],
      fullAddress: [undefined, [Validators.required]],
      currentJobLocation: [undefined, [Validators.required]],
      preferredJobLocation: [undefined, [Validators.required]],
      designation: [undefined, [Validators.required]],
      dateOfBirth: [{ value: undefined, disabled: false }],
      placeOfBirth: [undefined],
      maritalStatus: [undefined],
      gender: [undefined],
    });

    this.careerObjForm = this._formBuilder.group({
      careerObjective: [undefined, [Validators.required]],
    });

    this.skillForm = this._formBuilder.group({
      skillType: ['', [Validators.required]],
      ratingType: [this.ratingStyle, []],
      skillInput: [undefined],
    });

    if (this.currentTemplate === 'cubic') {
      this.skillForm.get('skillType').setValue('basic');
      this.skillForm.get('skillType').disable();
    } else if (this.currentTemplate === 'professional') {
      this.skillForm.get('skillType').setValue('basicWithRating');
      this.skillForm.get('skillType').disable();
    }

    this.skillForm.get('skillType').valueChanges.subscribe((val) => {
      if (val === 'basicStyled') {
        this.fontColor = '#fff';
        this.backColor = '#43a047';
      } else {
        this.fontColor = '';
        this.backColor = '';
      }
    });
    this.setupTinyMce();

    const userData = this.authService.currentUserValue;
    this.userEmail = userData ? userData.email : '';
    this.userName = userData ? userData.name : '';
  }

  ngAfterContentInit(): void {
    this.MockTemplate = templateMock;
    // this.loadComponent();
    // // Generate dynamic component with html
  }

  ngOnChanges(): void {
    // if ( this.isComponentLoaded === true) {
    //   // this.loadComponent();
    // }
  }

  private setupTinyMce(): void {
    tinymce.baseURL = 'assets'; // Need to display proper editor with its its folder in assets folder
    this.tinyEditorConfig = {
      // selector: 'textarea#editorId',
      // skin_url: '/skins', // Or loaded from your environments config
      suffix: '.min',       // Suffix to use when loading resources
      plugins: 'lists advlist',
      statusbar: false,
      browser_spellcheck: true,
      toolbar: 'bold italic underline | bullist numlist |  undo redo',
      height: 300,
      menubar: false,
      header: false,
    };
    tinymce.init(this.tinyEditorConfig);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Methods
  // -----------------------------------------------------------------------------------------------------

  templatePreview(): void {
    this.lastStep = true;
    setTimeout(() => {
      if (this.templateContent) {
        // if (this.container) {
        const data = this.templateContent['hostElement']['nativeElement']['innerHTML'];
        // const data = this.container['element']['nativeElement']['nextSibling']['innerHTML'];
        const dialogRef = this.matDialog.open(
          ResumePreviewComponent,
          {
            width: 'auto',
            height: '100%',
            data: data,
            restoreFocus: false
          },
        );
        dialogRef.beforeClosed().subscribe(() => {
          this.lastStep = false;
        });
      }
    }, 100);

  }

  /**
   * Get selected file for profile image
   * @param files Selected File
   */
  getFileData(files: FileList): void {
    if (files.length > 0) {
      // console.log(files);
      const fileData: File = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.onload = (() => {
        this.selectedImage = fileData;
        this.profileSrc = reader.result;
        this.profileFileName = fileData.name;
      });
    } else {
      this.profileSrc = null;
      this.profileFileName = null;
    }
  }

  saveAsPdf(pdf: any): void {
    // console.log('pdf', pdf);
    pdf.saveAs(`resume_${this.userName}`);
    this.generateImage(pdf, true);
  }

  public dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  generatePDF(pdf: any): void {
    this.lastStep = false;
    this.loaderService.show();
    pdf.export().then((group: Group) => exportPDF(group, AppConstant.PdfOptions)).then((dataUri: Blob) => {
      const fileObject = this.dataURLtoFile(dataUri, `resume_${this.userName}.pdf`);
      this.templatePdfFile = fileObject;
      // console.log('dataUri', dataUri);
      // console.log('fileObject', fileObject);
    }).then(() => {
      this.generateImage(pdf, false, true);
    }).catch(() => {
      this.loaderService.hide();
    });
  }

  generateImage(pdf: any, download = false, isLastStep = false): void {
    this.lastStep = true;
    const element = document.getElementById('template-resume');
    if (element) {
      const border = element.style.border;
      const shadow = element.style.boxShadow;
      // element.style.width = '100%';
      element.style.border = '';
      element.style.boxShadow = '';
      pdf.export().then((group: Group) => exportImage(group)).then((dataUri) => {
        this.templateImageBase64 = dataUri;
        element.style.width = '';
        element.style.border = border;
        element.style.boxShadow = shadow;
        if (!download) {
          this.saveTemplatePdfImg(isLastStep);
        } else {
          this.loaderService.hide();
        }
      });
    }
  }

  openWorkDialog(): void {

    const dialogRef = this.matDialog.open(
      AddWorkComponent,
      {
        width: 'auto',
        height: 'auto',
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((data: WorkModel) => {
      if (data) {
        this.workExperienceData.push(data);
      }
    });
  }

  openAddEducationModal(): void {

    const dialogRef = this.matDialog.open(
      AddEducationComponent,
      {
        width: 'auto',
        height: 'auto',
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((data: EducationModel) => {
      if (data) {
        this.educationData.push(data);
      }
    });
  }

  editWorkExperience(index: number, type: 'work' | 'education'): void {
    const component: any = type === 'work' ? AddWorkComponent : AddEducationComponent;
    const workData = this.workExperienceData.slice();
    const educationData = this.educationData.slice();
    const dialogData = type === 'work' ? workData[index] : educationData[index];
    const dialogRef = this.matDialog.open(
      component,
      {
        width: 'auto',
        height: 'auto',
        data: dialogData,
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        if (type === 'work') {
          this.workExperienceData[index] = data;
        } else {
          this.educationData[index] = data;
        }
      }
    });
  }

  deleteWorkExperience(index: number, type: 'work' | 'education'): void {
    if (index !== -1) {
      const dialogRef = this.matDialog.open(
        ConfirmationDialogComponent,
        {
          width: 'auto',
          height: 'auto',
          disableClose: true,
          data: {
            msg: 'Do you want to remove this detail ?',
          },
          id: 'confirmation-dialog'
        }
      );
      dialogRef.afterClosed().subscribe((data: boolean) => {
        if (data === true) {
          if (type === 'work') {
            this.workExperienceData.splice(index, 1);
          } else {
            this.educationData.splice(index, 1);
          }
        }
      });
    }
  }

  /**
   * Contact number validation
   * @param {*} event Key press event
   */
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**
   * Add skill event on mat chip selection
   * @param event Mat chip add event
   */
  addSkills(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our value
    if ((value || '').trim()) {
      this.skillRatingList.push({ skillName: value.trim(), ratings: 0 });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.skillForm.get('skillInput').setValue(null);
  }

  /**
   * On remove skills event
   * @param index Skill index
   */
  removeSkillItem(index: number): void {
    if (index >= 0) {
      this.skillRatingList.splice(index, 1);
    }
  }

  /**
   * Add Social Link Array
   */
  addSocialLink(): void {
    if (this.socialLinkArray.length < this.maxSocialLinks) {
      this.socialLinkArray.push(
        {
          website: '',
          link: ''
        }
      );
    }
  }

  /**
   * Remove Social Link Array
   */
  removeSocialLink(index: number): void {
    if (index !== -1) {
      this.socialLinkArray.splice(index, 1);
    }
  }

  /**
   * Add / Remove additional info data
   * @param checked Checkbox checked property
   * @param type Additional info type
   */
  addRemoveAdditional(checked: boolean, type: string): void {

    if (checked) {
      let dialogData = {
        type: type,
        value: undefined,
      };
      let isExist: number;
      const data = _.clone(this.additionalInfoData);
      if (data.length > 0) {
        isExist = data.findIndex((info: AdditionalModel) => {
          return info.type.toLowerCase() === type.toLowerCase();
        });
        if (isExist !== -1) {
          dialogData = data[isExist];
        }
      }
      const dialogRef = this.matDialog.open(AdditionalInfoComponent, {
        width: '800px',
        height: 'auto',
        disableClose: true,
        data: dialogData,
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response) {
          if (isExist !== undefined && isExist !== -1) {
            this.additionalInfoData[isExist] = response;
          } else {
            this.additionalInfoData.push(response);
          }
        }
      });
    } else {
      const index = this.additionalInfoData.findIndex((info: AdditionalModel) => {
        return info.type.toLowerCase() === type.toLowerCase();
      });
      if (index !== -1) {
        this.additionalInfoData.splice(index, 1);
      }
    }
  }

  editAdditional(value): void {
    const data = _.cloneDeep(this.additionalInfoData);
    const isExist = data.findIndex((info: AdditionalModel) => {
      return info.type.toLowerCase() === value.type.toLowerCase();
    });
    const dialogRef = this.matDialog.open(AdditionalInfoComponent, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: value,
      restoreFocus: true,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        if (isExist !== -1) {
          data[isExist] = response;
        } else {
          data.push(response);
        }
        this.additionalInfoData = data;
      } else {
        this.additionalInfoData = data;
      }
    });
  }

  stepChange(event: StepperSelectionEvent): void {
    this.selectedIndex = event.selectedIndex;
    // const stepperElement = document.getElementById('resume-stepper');
    // if ( stepperElement ) {
    //   stepperElement.scrollIntoView();
    // }
    if (this.selectedIndex >= 4) {
      this.allowDownload = true;
    } else {
      this.allowDownload = false;
    }
    // this.cdRef.detectChanges();
  }

  finishStep(): void {
    if (!this.resumeId) {
      this.toastrService.displaySnackBar('Please save previous steps', 'error');
      return;
    }
    if (this.skillForm.invalid || this.skillRatingList.length === 0) {
      this.toastrService.displaySnackBar('Please add atleast one skill', 'error');
      // this.skillForm.get('skillType').markAsTouched();
      return;
    }
    if (this.selectedIndex === 4) {
      if (!this.haveAdditionalInfo) {
        const dialogRef = this.matDialog.open(
          ConfirmationDialogComponent,
          {
            width: 'auto',
            height: 'auto',
            disableClose: true,
            data: {
              msg: 'Do you want to add Additional Information ?',
            },
            id: 'confirmation-dialog',
            panelClass: 'custom-confirmation'
          }
        );
        dialogRef.afterClosed().subscribe((resp: boolean) => {
          if (resp === true) {
            this.saveSkills(true);
          } else {
            this.saveSkills();
          }
        });
      } else {
        this.saveSkills();
      }
    }
  }

  /**
   * Handle datepicker input
   */
  handlePicker(event: KeyboardEvent, picker: MatDatepicker<moment.Moment>, isTyping = false): void {
    // console.log('event', event);
    // console.log('isTyping', isTyping);
    if (isTyping && event.key !== 'Tab') {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    if (picker && picker.opened) {
      picker.close();
    } else {
      picker.open();
    }
    event.stopPropagation();
    event.preventDefault();
    return;
  }

  /**
   * On form submit
   */
  formSubmit(): void {
    if (this.selectedIndex === 0) {
      this.savePersonalInfo();
    } else if (this.selectedIndex === 1) {
      this.saveCareerObjective();
    } else if (this.selectedIndex === 2) {
      this.saveWorkData();
    } else if (this.selectedIndex === 3) {
      if (this.educationData.length === 0) {
        this.toastrService.displaySnackBar('Please add atleast one education detail', 'error');
        return;
      } else {
        this.saveEducation();
      }
    }
  }

  savePersonalInfo(): void {

    if (this.basicDetailForm.valid) {
      const formValue = this.basicDetailForm.value;
      let profileImage = this.profileSrc;
      if (
        this.resumeEditData && this.resumeEditData.personalInfo &&
        this.resumeEditData.personalInfo.profileImage && !this.selectedImage
      ) {
        profileImage = '';
      }
      const params: any = {
        'params': {
          'personalInfo': {
            'firstName': formValue.firstName,
            'lastName': formValue.lastName,
            'contactNumber': formValue.contactNumber,
            'email': this.userEmail,
            'fullAddress': formValue.fullAddress,
            'currentJobLocation': formValue.currentJobLocation,
            'preferredJobLocation': formValue.preferredJobLocation,
            'dateOfBirth': formValue.dateOfBirth ?
              this.commonService.getMomentFormattedDate(formValue.dateOfBirth) : '',
            'placeOfBirth': formValue.placeOfBirth,
            'maritalStatus': formValue.maritalStatus,
            'gender': formValue.gender,
            'socialLinks': this.socialLinkArray,
            'imageName': this.selectedImage ? this.profileFileName : '',
            'designation': formValue.designation,
            'photo': profileImage,
          }
        }
      };
      if (this.resumeId) {
        params.params.id = this.resumeId;
      } else {
        params.params.templateId = this.templateId;
      }

      this.resumeBuilderService.addUpdateResume(AppConstant.ResumeFormApi.saveFirstStepApi, params)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (response) => {
            this.selectedIndex = this.selectedIndex + 1;
            if (response && response.data && response.data._id) {
              this.resumeId = response.data._id;
              this.everyStepSaveImage();
            }
          },
          error => { }
        );
    } else {
      this.toastrService.displaySnackBar('Please fill required fields', 'error');
    }

  }

  saveCareerObjective(): void {
    if (!this.resumeId) {
      this.toastrService.displaySnackBar('Please save first step', 'error');
      return;
    }
    const params = {
      'params': {
        'id': this.resumeId,
        'careerObjective': this.careerObjForm.value.careerObjective
      }
    };
    this.resumeBuilderService.addUpdateResume(AppConstant.ResumeFormApi.saveSecondStepApi, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          this.selectedIndex = this.selectedIndex + 1;
          this.everyStepSaveImage();
        },
        error => { }
      );

  }

  saveWorkData(): void {
    if (!this.resumeId) {
      this.toastrService.displaySnackBar('Please save first step', 'error');
      return;
    }
    const data = [];
    if (this.workExperienceData) {
      this.workExperienceData.forEach((record) => {
        data.push({
          'companyName': record.companyName,
          'location': record.location,
          'designation': record.designation,
          'joiningDate': this.commonService.getMomentFormattedDate(record.joiningDate),
          'leavingDate': this.commonService.getMomentFormattedDate(record.leavingDate),
          'jobDescription': record.jobDescription
        });
      });
    }
    const params = {
      'params': {
        'id': this.resumeId,
        'workExperience': data
      }
    };
    this.resumeBuilderService.addUpdateResume(AppConstant.ResumeFormApi.saveThirdStepApi, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          this.selectedIndex = this.selectedIndex + 1;
          this.everyStepSaveImage();
        },
        error => { }
      );
  }

  saveEducation(): void {
    if (!this.resumeId) {
      this.toastrService.displaySnackBar('Please save first step', 'error');
      return;
    }
    const data = [];
    if (this.educationData) {
      this.educationData.forEach((record) => {
        data.push({
          'collegeName': record.collegeName,
          'universityName': record.universityName,
          'courseName': record.courseName,
          'yearOfPassing': this.commonService.getMomentFormattedDate(record.yearOfPassing),
        });
      });
    }
    const params = {
      'params': {
        'id': this.resumeId,
        'educationHistory': data
      }
    };
    this.resumeBuilderService.addUpdateResume(AppConstant.ResumeFormApi.saveFourthStepApi, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          this.selectedIndex = this.selectedIndex + 1;
          this.everyStepSaveImage();
        },
        error => { }
      );
  }

  saveSkills(haveAdditionalInfo = false): void {
    if (!this.resumeId) {
      this.toastrService.displaySnackBar('Please save previous steps', 'error');
      return;
    }
    const params = {
      'params': {
        'id': this.resumeId,
        'skills': this.skillRatingList
      }
    };
    this.resumeBuilderService.addUpdateResume(AppConstant.ResumeFormApi.saveFifthStepApi, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          if (haveAdditionalInfo) {
            this.haveAdditionalInfo = true;
            this.cdRef.detectChanges();
            this.selectedIndex = 5;
          } else {
            // this.saveTemplatePdfImg();
            if (this.pdfComponent) {
              this.generatePDF(this.pdfComponent);
            }
          }

        },
        error => { }
      );

  }

  saveAdditionalInfo(): void {
    let additionalData = _.cloneDeep(this.additionalInfoData);
    additionalData = additionalData.filter((info) => {
      if (info.type.toLowerCase() === 'accomplishments' || info.type.toLowerCase() === 'affiliations') {
        info.value = [info.value];
      } else if (info.type.toLowerCase() === 'certifications') {
        info.value = info.value.filter((value: any) => {
          if (value.date) {
            value.date = this.commonService.getMomentFormattedDate(value.date);
          }
          return value;
        });
      }
      return info;
    });
    const params = {
      'params': {
        'id': this.resumeId,
        'additionalInfo': additionalData,
      }
    };
    this.resumeBuilderService.addUpdateResume(AppConstant.ResumeFormApi.saveSixthStepApi, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          if (response.code === 200) {
            if (this.pdfComponent) {
              this.generatePDF(this.pdfComponent);
            }
          }
        },
        error => { }
      );
  }

  getResumeData(resumeId: string): void {

    const params = {
      'params': {
        'resumeId': resumeId
      }
    };

    this.resumeBuilderService.getTemplateResumeDetail(this.getEditUrl, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((resumeData) => {
        if (resumeData.code === 200 && resumeData.data) {
          this.resumeEditData = resumeData.data;
          this.setResumeData(this.resumeEditData);
        }
      });

  }

  setResumeData(resumeEditData: MyResumesModel): void {

    if (resumeEditData.personalInfo) {
      const personalData = resumeEditData.personalInfo;
      this.basicDetailForm.setValue({
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        contactNumber: personalData.contactNumber,
        fullAddress: personalData.fullAddress,
        currentJobLocation: personalData.currentJobLocation || '',
        preferredJobLocation: personalData.preferredJobLocation || '',
        designation: personalData.designation || '',
        dateOfBirth: this.commonService.getMomentFromDate(personalData.dateOfBirth) || null,
        placeOfBirth: personalData.placeOfBirth || null,
        maritalStatus: personalData.maritalStatus || null,
        gender: personalData.gender || null,
      });
      this.socialLinkArray = personalData.socialLinks;
      if (resumeEditData.personalInfo.profileImage) {
        this.profileSrc = this.imageBaseUrl + resumeEditData.personalInfo.profileImage;
      }
    }

    if (resumeEditData.careerObjective) {
      this.careerObjForm.setValue({
        careerObjective: resumeEditData.careerObjective,
      });
    }

    this.educationData = resumeEditData.educationHistory.filter((value) => {
      return value.yearOfPassing = this.commonService.getMomentFromDate(value.yearOfPassing);
    });
    this.workExperienceData = resumeEditData.workExperience.filter((value) => {
      if (value) {
        value.joiningDate = this.commonService.getMomentFromDate(value.joiningDate);
        value.leavingDate = this.commonService.getMomentFromDate(value.leavingDate);
      }
      return value;
    });
    if (resumeEditData.additionalInfo && resumeEditData.additionalInfo.length > 0) {
      this.additionalInfoData = resumeEditData.additionalInfo.filter((info) => {
        if (info.type.toLowerCase() === 'accomplishments' || info.type.toLowerCase() === 'affiliations') {
          info.value = typeof info.value === 'object' && info.value.length > 0 ? info.value[0] : '';
        } else if (info.type.toLowerCase() === 'certifications') {
          info.value = info.value.filter((value: any) => {
            if (value.date) {
              value.date = this.commonService.getMomentFromDate(value.date);
            }
            return value;
          });
        }
        const selected = this.additionalInfoList.findIndex((add) => add.value.toLowerCase() === info.type.toLowerCase());
        if (selected !== -1) {
          this.additionalInfoList[selected].checked = true;
        }
        return info;
      });
      this.haveAdditionalInfo = true;
      this.cdRef.detectChanges();
    }
    this.skillRatingList = resumeEditData.skills;
    this.isLinear = false;
  }

  saveTemplatePdfImg(isLastStep = false): void {
    this.loaderService.show();

    const formData = new FormData();
    if (isLastStep) {
      formData.append('pdf', this.templatePdfFile);
    }

    formData.append('imageName', `resume_image_${this.userName}`);
    formData.append('photo', this.templateImageBase64);
    formData.append('id', this.resumeId);

    this.resumeBuilderService.addUpdateResume(AppConstant.ResumeFormApi.saveImgPdfStepApi, formData)
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.loaderService.hide();
            if (isLastStep) {
              this.toastrService.displaySnackBar('Your resume has been saved', 'success');
              this.router.navigate(['/user/my-resumes']);
            } else {
              this.lastStep = false;
            }
          }
        },
        (error) => {
          this.loaderService.hide();
          this.toastrService.displaySnackBar('Something went wrong while saving your resume. Please try again.', 'error');
        }
      );

  }

  loadComponent(): void {

    let componentFactory;
    if (this.currentTemplate === 'cubic') {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(ResumeTemplateComponent);
    } else if (this.currentTemplate === 'professional') {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(ResumeProfessionalComponent);
    }

    const viewContainerRef = this.dynamicTemplate.viewContainerRef;
    viewContainerRef.clear();

    if (componentFactory) {
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<any>componentRef.instance).templateForm = this.basicDetailForm.getRawValue();
      (<any>componentRef.instance).userEmail = this.userEmail;
      (<any>componentRef.instance).experienceData = this.workExperienceData;
      (<any>componentRef.instance).careerObjective = this.careerObjForm.get('careerObjective').value;
      (<any>componentRef.instance).educationData = this.educationData;
      (<any>componentRef.instance).skillData = this.skillRatingList;
      (<any>componentRef.instance).additionalInfo = this.additionalInfoData;
      (<any>componentRef.instance).socialData = this.socialLinkArray;
      (<any>componentRef.instance).profileSrc = this.profileSrc;
      // this.loaderService.hide();
      this.isComponentLoaded = true;
    }

  }

  everyStepSaveImage(): void {
    if (this.pdfComponent) {
      this.generateImage(this.pdfComponent, false, false);
    }
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (!this.resumeEditData && this.basicDetailForm.touched &&
      (this.basicDetailForm.invalid || this.careerObjForm.invalid ||
        this.selectedIndex > 0
      )
    ) {
      const dialogRef = this.matDialog.open(
        ConfirmationDialogComponent,
        {
          width: 'auto',
          height: 'auto',
          disableClose: true,
          data: {
            msg: 'Your changes will be lost, are you sure you want to exit ?',
          },
          id: 'deactivate-dialog'
        }
      );
      return dialogRef.afterClosed();
    } else {
      return true;
    }

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    localStorage.removeItem('selected');
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
