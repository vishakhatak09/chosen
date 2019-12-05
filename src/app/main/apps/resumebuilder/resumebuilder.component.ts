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
  Compiler,
  ComponentFactory,
  NgModule,
  ModuleWithComponentFactories,
  ViewContainerRef,
  ComponentRef,
  AfterContentInit,
  AfterViewInit,
  ComponentFactoryResolver
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatChipInputEvent } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AppConstant, OptionType } from 'core/constants/app.constant';
import { ResumeMock } from 'core/mock/resume.mock';
import { templateMock } from 'core/mock/temp-content';
import {
  AdditionalModel,
  EducationModel,
  SkillRating,
  SocialModel,
  WorkModel
} from 'core/models/resumebuilder.model';
import { ToastrService } from 'core/services/toastr.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import 'tinymce/tinymce.min.js';
import { ConfirmationDialogComponent } from '../../pages/common-components/confirmation/confirmation.component';
import { AddEducationComponent } from './add-education/add-education.component';
import { AddWorkComponent } from './add-work/add-work.component';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { ResumePreviewComponent } from './resume-preview/resume-preview.component';
import { ResumebuilderModule } from './resumebuilder.module';
import { ResumeBuilderService } from './resumebuilder.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'core/services/authentication.service';
declare var tinymce: any;
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import * as _ from 'lodash';
import { CommonService } from 'core/services/common.service';
import { ResumeTemplateComponent } from './resume-template/resumetemplate.component';
import { takeUntil } from 'rxjs/operators';

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
export class ResumebuilderComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {

  public defaultProfile = environment.baseUrl + 'assets/images/logos/profile.jpg';
  saveFirstStepApi = environment.serverBaseUrl + 'api/resume/resumeFirstStep';
  public profileSrc: string | ArrayBuffer;
  public profileFileName: string;
  public basicDetailForm: FormGroup;
  public careerObjForm: FormGroup;
  maxDate = new Date();
  maritalStatuOpts: OptionType[] = AppConstant.MaritalStatusOptions;
  genderOptions: OptionType[] = AppConstant.GenderOptions;
  baseUrl = environment.baseUrl;
  maxRate = 5;
  currentRate = 0;
  ratingStyle = 'square';
  skillOptions: OptionType[] = AppConstant.SkillCustomOptions;
  skillRatingList: SkillRating[] = [];
  ratingThemeList: OptionType[] = AppConstant.RatingThemes;

  tinyEditorConfig = {};
  workExperienceData: WorkModel[] = [];
  educationData: EducationModel[] = [];
  fontColor = '#fff';
  backColor = '#43a047';
  defaultColor = '#fff';
  public haveAdditionalInfo = false;
  socialLinkArray: SocialModel[] = [];
  public socialSites: string[] = AppConstant.SocialSites;
  urlPattern = AppConstant.ValidUrlPattern;
  additionalInfoList = AppConstant.AdditionalInfo;
  additionalInfoData: AdditionalModel[] = [];
  allowDownload = false;

  @ViewChild('templateRef', { static: false }) templateContent: ElementRef;
  separatorKeysCodes: number[] = [ENTER];
  selectedIndex = 0;
  public MockTemplate: string;
  isLinear = true;
  userEmail: string;

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();
  skillForm: FormGroup;

  @ViewChild('container', { read: ViewContainerRef, static: false })
  container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;

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
    private compiler: Compiler,
    private domSanitizer: DomSanitizer,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {

    this.basicDetailForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(AppConstant.ValidPhonePattern)]],
      // email: ['', [Validators.required, Validators.email]],
      fullAddress: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      dateOfBirth: [{ value: '', disabled: false }],
      placeOfBirth: [''],
      maritalStatus: [''],
      gender: [''],
    });

    this.careerObjForm = this._formBuilder.group({
      careerObjective: ['', [Validators.required]],
    });

    this.skillForm = this._formBuilder.group({
      skillType: ['basic', [Validators.required]],
      ratingType: [this.ratingStyle, []],
      skillInput: [''],
    });

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
    this.sendTemplateValues();

    const userData = this.authService.currentUserValue;
    this.userEmail = userData ? userData.email : '';
  }

  ngAfterContentInit(): void {
    this.MockTemplate = templateMock;
    // // Generate dynamic component with html
    // setTimeout(() => {
    //   // this.generateRunTimeComponent();
    //   this.cdRef.detectChanges();
    // }, 0);
  }

  ngAfterViewInit(): void {
    // Generate dynamic component with html
    setTimeout(() => {
      // // this.generateRunTimeComponent();
      this.cdRef.detectChanges();
    }, 0);
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
    if (this.selectedIndex === 4 || this.selectedIndex === 5) {
      // this.generateRunTimeComponent(true);
    }
    setTimeout(() => {
      if (this.templateContent) {
        // if (this.container) {
        const data = this.templateContent['hostElement']['nativeElement']['innerHTML'];
        // const data = this.container['element']['nativeElement']['nextSibling']['innerHTML'];
        this.matDialog.open(
          ResumePreviewComponent,
          {
            width: 'auto',
            data: data,
          },
        );
      }
    }, 100);

  }

  /**
   * Get selected file for profile image
   * @param files Selected File
   */
  getFileData(files: FileList): void {
    if (files.length > 0) {
      const fileData: File = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.onload = (() => {
        this.profileSrc = reader.result;
        this.profileFileName = fileData.name;
      });
    } else {
      this.profileSrc = null;
      this.profileFileName = null;
    }
  }

  saveAsPdf(): void {

    html2canvas(document.querySelector('#save-template')).then(canvas => {

      const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);

      const imgData = canvas.toDataURL('image/jpg', 1.0);
      pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
      pdf.save('resume_' + moment().toDate().getTime() + '.pdf');

    });
    // const doc = new jsPDF();
    // doc.addHTML(this.templateContent.nativeElement , () => {
    //   const timestamp = Date.now();
    //   doc.save(`resume_${timestamp}.pdf`);
    // });
    // doc.text('Hello world!', 10, 10);
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
        // // this.generateRunTimeComponent();
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
        // this.generateRunTimeComponent();
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
        // this.generateRunTimeComponent();
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
          // this.generateRunTimeComponent();
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
    this.socialLinkArray.push(
      {
        website: '',
        link: ''
      }
    );
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
          this.additionalInfoData.filter((info) => {
            if (info.type.toLowerCase() === 'accomplishments' || info.type.toLowerCase() === 'affiliations') {
              info.value = this.domSanitizer.bypassSecurityTrustHtml(info.value);
            }
            return info;
          });
          // this.generateRunTimeComponent(true);
        }
      });
    } else {
      const index = this.additionalInfoData.findIndex((info: AdditionalModel) => {
        return info.type.toLowerCase() === type.toLowerCase();
      });
      if (index !== -1) {
        this.additionalInfoData.splice(index, 1);
        // this.generateRunTimeComponent(true);
      }
    }
  }

  editAdditional(value): void {
    const data = Array.from(this.additionalInfoData);
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
        // this.generateRunTimeComponent(true);
      } else {
        this.additionalInfoData = data;
      }
    });
  }

  stepChange(event: StepperSelectionEvent): void {
    this.selectedIndex = event.selectedIndex;
    if (this.selectedIndex >= 4) {
      this.allowDownload = true;
    } else {
      this.allowDownload = false;
    }
  }

  finishStep(): void {
    if (this.skillForm.invalid || this.skillRatingList.length === 0) {
      this.skillForm.get('skillType').markAsTouched();
      return;
    }
    // this.generateRunTimeComponent(true);
    if (this.selectedIndex === 4) {
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
          this.haveAdditionalInfo = true;
          setTimeout(() => {
            this.selectedIndex = 5;
          }, 10);
        }
      });
    } else {
      this.toastrService.displaySnackBar('Your resume has been saved', 'success');
    }
  }

  sendTemplateValues(): void {
    // this.resumeBuilderService.templateData.next(
    //   {
    //     templateContent: templateMock,
    //   }
    // );
    this.basicDetailForm.valueChanges
      .subscribe((_val) => {
        // this.generateRunTimeComponent();
      });

    this.careerObjForm.valueChanges
      .subscribe((value) => {
        // this.generateRunTimeComponent();
      });

    this.skillForm.valueChanges
      .subscribe((_val) => {
        // this.generateRunTimeComponent();
      });
  }

  private createComponentFactorySync(
    metadata: Component, componentClass: any, componentData: any, compiler?: Compiler,
  ): any {
    const cmpClass = componentClass || class RuntimeComponent {
      templateForm = componentData.templateForm;
      experienceData = componentData.experienceData;
      careerObjective = componentData.careerObjective;
      educationData = componentData.educationData;
      skillData = componentData.skillData;
      additionalInfo = componentData.additionalInfo;
      socialData = componentData.socialData;
      profileSrc = componentData.profileSrc;
      content = componentData.content;
      skillMockData = [];
      fontColor = componentData.fontColor;
      backColor = componentData.backColor;
    };
    const decoratedCmp = Component(metadata)(cmpClass);
    // return decoratedCmp;

    @NgModule({ imports: [ResumebuilderModule, CommonModule], declarations: [decoratedCmp] })
    class RuntimeComponentModule { }

    const module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }

  async compileTemplate(data: any) {

    const metadata = {
      selector: `template-sample`,
      template: this.MockTemplate,
    };

    // console.log('compiler', this.compiler);
    const factory = this.createComponentFactorySync(metadata, null, data, this.compiler);
    // console.log('factory', factory);
    // console.log('this.container', this.container);
    // const factory = this.componentFactoryResolver.resolveComponentFactory(this.createComponentFactorySync(metadata, null, data));
    // console.log(factory)
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);
    this.cdRef.detectChanges();

    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ResumeTemplateComponent);
    // const viewContainerRef = this.container;
    // viewContainerRef.clear();

    // const componentRef = viewContainerRef.createComponent(componentFactory);
    // // componentRef.hostView
    // (<any>componentRef.instance).templateForm = data.templateForm;
    // (<any>componentRef.instance).experienceData = data.experienceData;
    // (<any>componentRef.instance).careerObjective = data.careerObjective;
    // (<any>componentRef.instance).educationData = data.educationData;
    // (<any>componentRef.instance).skillData = data.skillData;
    // (<any>componentRef.instance).additionalInfo = data.additionalInfo;
    // (<any>componentRef.instance).socialData = data.socialData;
    // (<any>componentRef.instance).profileSrc = data.profileSrc;
    // (<any>componentRef.instance).content = data.content;
    // (<any>componentRef.instance).skillMockData = data.skillMockData;
    // (<any>componentRef.instance).fontColor = data.fontColor;
    // (<any>componentRef.instance).backColor = data.backColor;

  }

  generateRunTimeComponent(isLastSteps = false): void {

    let data = {};

    // this.additionalInfoData.filter((info) => {
    //   if (info.type.toLowerCase() === 'accomplishments' || info.type.toLowerCase() === 'affiliations') {
    //     info.value = this.domSanitizer.bypassSecurityTrustHtml(info.value);
    //   }
    //   return info;
    // });

    if (!isLastSteps) {

      let basicDetail: any;
      if (this.basicDetailForm) {
        basicDetail = this.basicDetailForm.getRawValue();
        basicDetail.email = this.userEmail;
      }

      data = {
        templateForm: basicDetail || ResumeMock.templateForm,
        experienceData: this.workExperienceData.length > 0 ? this.workExperienceData : ResumeMock.experienceData ,
        careerObjective: this.careerObjForm ? this.careerObjForm.get('careerObjective').value : ResumeMock.data.careerObjective,
        educationData: this.educationData.length > 0 ? this.educationData : ResumeMock.educationData,
        skillData: this.skillRatingList.length > 0 ? this.skillRatingList : ResumeMock.skillData,
        additionalInfo: this.additionalInfoData,
        socialData: this.socialLinkArray,
        profileSrc: this.profileSrc || this.defaultProfile,
        content: this.MockTemplate,
        fontColor: basicDetail && this.skillForm.get('skillType').value === 'basicStyled' ? this.fontColor : 'rgba(0, 0, 0, 0.87)',
        backColor: basicDetail && this.skillForm.get('skillType').value === 'basicStyled' ? this.backColor : '#e0e0e0',
      };

    } else {

      const basicDetail = this.basicDetailForm.getRawValue();
      basicDetail.email = this.userEmail;

      data = {
        templateForm: basicDetail,
        experienceData: this.workExperienceData,
        careerObjective: this.careerObjForm.get('careerObjective').value,
        educationData: this.educationData,
        skillData: this.skillRatingList,
        additionalInfo: this.additionalInfoData,
        socialData: this.socialLinkArray,
        profileSrc: this.profileSrc,
        content: this.MockTemplate,
        fontColor: basicDetail && this.skillForm.get('skillType').value === 'basicStyled' ? this.fontColor : 'rgba(0, 0, 0, 0.87)',
        backColor: basicDetail && this.skillForm.get('skillType').value === 'basicStyled' ? this.backColor : '#e0e0e0',
      };

    }

    this.compileTemplate(data);

  }

  /**
   * Handle datepicker input
   */
  handlePicker(event: KeyboardEvent, picker: MatDatepicker<moment.Moment>, isTyping = false): void {
    if (isTyping) {
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
    }
    // console.log(this.basicDetailForm.getRawValue());
    // console.log('skillRatingList', this.skillRatingList);
  }

  savePersonalInfo(): void {

    if (this.basicDetailForm.valid) {
      this.selectedIndex = this.selectedIndex + 1;
      // const formValue = this.basicDetailForm.value;
      // const params = {
      //   'params': {
      //     'id': '5ddab414f3f1c83f98392d8c',
      //     'personalInfo': {
      //       'firstName': formValue.firstName,
      //       'lastName': formValue.lastName,
      //       'contactNumber': formValue.contactNumber,
      //       'email': formValue.email,
      //       'fullAddress': formValue.fullAddress,
      //       'dateOfBirth': formValue.dateOfBirth ?
      //         this.commonService.getMomentFormattedDate(formValue.dateOfBirth) : '',
      //       'placeOfBirth': formValue.placeOfBirth,
      //       'maritalStatus': formValue.maritalStatus,
      //       'gender': formValue.gender,
      //       'profileImage': this.profileSrc,
      //       'socialLinks': this.socialLinkArray,
      //     }
      //   }
      // };

      // this.resumeBuilderService.addUpdateResume(this.saveFirstStepApi, params)
      //   .pipe(takeUntil(this._unsubscribeAll))
      //   .subscribe(
      //     (response) => {
      //       // this.selectedIndex = this.selectedIndex + 1;
      //     },
      //     error => { }
      //   );

    }

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
