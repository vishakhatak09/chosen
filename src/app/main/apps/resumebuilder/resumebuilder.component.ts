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
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { fuseAnimations } from '@fuse/animations';
import { AppConstant, OptionType } from 'core/constants/app.constant';
import { LanguageList } from 'core/constants/locale';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import {
  SkillRating,
  WorkModel,
  EducationModel,
  SocialModel,
  AdditionalModel
} from 'core/models/resumebuilder.model';
import { MatDialog } from '@angular/material/dialog';
// import { ResumeTemplateComponent } from './resume-template/resumetemplate.component';
import { ResumeBuilderService } from './resumebuilder.service';
// import jsPDF from 'jspdf';
import { AddWorkComponent } from './add-work/add-work.component';
import { AddEducationComponent } from './add-education/add-education.component';
import { ConfirmationDialogComponent } from '../../pages/common-components/confirmation/confirmation.component';
import { ENTER } from '@angular/cdk/keycodes';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ToastrService } from 'core/services/toastr.service';
import { templateMock } from 'core/mock/temp-content';
import { ResumePreviewComponent } from './resume-preview/resume-preview.component';
import { ResumebuilderModule } from './resumebuilder.module';
import { CommonModule } from '@angular/common';
import { ResumeMock } from 'core/mock/resume.mock';
import 'tinymce';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
declare var tinymce: any;

@Component({
  selector: 'app-resumebuilder',
  templateUrl: './resumebuilder.component.html',
  styleUrls: ['./resumebuilder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResumebuilderComponent implements OnInit, OnDestroy, AfterContentInit {

  public defaultProfile = environment.baseUrl + 'assets/images/logos/profile.jpg';
  public profileSrc: string | ArrayBuffer;
  public profileFileName: string;
  public basicDetailForm: FormGroup;
  public careerObjForm: FormGroup;
  // public eduForm: FormGroup;
  maxDate = new Date();
  maritalStatuOpts: OptionType[] = AppConstant.MaritalStatusOptions;
  genderOptions: OptionType[] = AppConstant.GenderOptions;
  baseUrl = environment.baseUrl;
  languagesList: string[] = LanguageList.list;
  filteredLanguages: Observable<string[]>;
  selectedLanguages: string[] = [];
  maxRate = 5;
  currentRate = 0;
  ratingStyle = 'square';
  skillOptions: OptionType[] = AppConstant.SkillCustomOptions;
  basicSkill = '';
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

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('templateRef', { static: false }) templateContent: ElementRef;
  separatorKeysCodes: number[] = [ENTER];
  selectedIndex = 0;
  public MockTemplate: string;

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
  ) {
    // this.MockTemplate = templateMock;
    // this.generateRunTimeComponent();
  }

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
      email: ['', [Validators.required, Validators.email]],
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
      skillType: ['', [Validators.required]],
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
  }

  ngAfterContentInit(): void {
    this.MockTemplate = templateMock;
    setTimeout(() => {
      // console.log(this.container);
      this.generateRunTimeComponent();
      this.cdRef.detectChanges();
    }, 1000);
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
      setup: (editor) => {
        editor.on('init', (e) => {
          // console.log('editor initialized', e);
        });
      }
    };
    tinymce.init(this.tinyEditorConfig);
    // this.MockTemplate = templateMock;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On form submit
   */
  formSubmit(): void {
    console.log(this.basicDetailForm.getRawValue());
    console.log('skillRatingList', this.skillRatingList);
  }

  /**
   * Add langugage event on mat chip selection
   * @param event Mat chip add event
   */
  addLang(event: MatChipInputEvent): void {
    // Add langugage only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our value
      if ((value || '').trim()) {
        const index = this.languagesList.indexOf(value);
        const selected = this.selectedLanguages.indexOf(value);
        if (index !== -1 && selected === -1) {
          this.selectedLanguages.push(value.trim());
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.basicDetailForm.get('languages').setValue(null);
    }
  }

  /**
   * On remove language event
   * @param lang Selected langugage
   */
  removeLang(lang: string): void {
    const index = this.selectedLanguages.indexOf(lang);

    if (index >= 0) {
      this.selectedLanguages.splice(index, 1);
    }
  }

  /**
   * On language select event
   * @param event Autocomplete select
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    const index = this.languagesList.indexOf(value);
    const selected = this.selectedLanguages.indexOf(value);
    if (index !== -1 && selected === -1) {
      this.selectedLanguages.push(value.trim());
    }
    this.basicDetailForm.get('languages').setValue(null);
  }

  /**
   * On change of skill type
   * @param seletedSkill 'basic' | 'withBox' | 'withRating'
   */
  skillTypeSelecttion(seletedSkill: 'basic' | 'withBox' | 'withRating'): void {
    this.skillRatingList = [];
    this.basicSkill = '';
  }

  templatePreview(): void {
    if (this.container) {
      // const data = this.templateContent['hostElement']['nativeElement']['innerHTML'];
      const data = this.container['element']['nativeElement']['nextSibling']['innerHTML'];
      const dialogRef = this.matDialog.open(
        // ResumeTemplateComponent,
        // Template1Component,
        ResumePreviewComponent,
        {
          width: 'auto',
          data: data,
        },
      );
    }

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
        this.generateRunTimeComponent();
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
        this.generateRunTimeComponent();
      }
    });
  }

  editWorkExperience(index: number, type: 'work' | 'education'): void {
    const component: any = type === 'work' ? AddWorkComponent : AddEducationComponent;
    const dialogData = type === 'work' ? this.workExperienceData[index] : this.educationData[index];
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
        this.generateRunTimeComponent();
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
          this.generateRunTimeComponent();
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
      const data = this.additionalInfoData.map(item => ({
        ...item,
      }));
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
          this.generateRunTimeComponent();
        }
      });
    } else {
      const index = this.additionalInfoData.findIndex((info: AdditionalModel) => {
        return info.type.toLowerCase() === type.toLowerCase();
      });
      if (index !== -1) {
        this.additionalInfoData.splice(index, 1);
        this.generateRunTimeComponent();
      }
    }
  }

  /**
   * Mat tab index change event
   * @param tabIndex Current tab index
   */
  tabChangeEvent(tabIndex: number): void {
    if (tabIndex >= 4) {
      this.allowDownload = true;
    } else {
      this.allowDownload = false;
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
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        if (isExist !== -1) {
          this.additionalInfoData[isExist] = response;
        } else {
          this.additionalInfoData.push(response);
        }
        this.generateRunTimeComponent();
      } else {
        this.additionalInfoData = data;
      }
    });
  }

  stepChange(event: StepperSelectionEvent): void {
    this.selectedIndex = event.selectedIndex;
  }

  finishStep(): void {
    this.generateRunTimeComponent(true);
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
    this.resumeBuilderService.templateData.next(
      {
        templateContent: templateMock,
      }
    );
    this.basicDetailForm.valueChanges
      .subscribe((_val) => {
        this.generateRunTimeComponent();
      });

    this.careerObjForm.valueChanges
      .subscribe((value) => {
        this.generateRunTimeComponent();
      });

    this.skillForm.valueChanges
      .subscribe((_val) => {
        this.generateRunTimeComponent();
      });
  }

  private createComponentFactorySync(
    compiler: Compiler, metadata: Component, componentClass: any, componentData: any
  ): ComponentFactory<any> {
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
      Arr = componentData.Arr;
    };
    const decoratedCmp = Component(metadata)(cmpClass);

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

    const factory = this.createComponentFactorySync(this.compiler, metadata, null, data);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);
    this.cdRef.detectChanges();
  }

  generateRunTimeComponent(isLastSteps = false): void {

    let data = {};
    if (!isLastSteps) {

      data = {
        templateForm: this.basicDetailForm ? this.basicDetailForm.getRawValue() : ResumeMock.templateForm,
        experienceData: this.workExperienceData.length > 0 ? this.workExperienceData : ResumeMock.experienceData,
        careerObjective: this.careerObjForm ? this.careerObjForm.get('careerObjective').value : ResumeMock.data.careerObjective,
        educationData: this.educationData.length > 0 ? this.educationData : ResumeMock.educationData,
        skillData: this.skillRatingList.length > 0 ? this.skillRatingList : ResumeMock.skillData,
        additionalInfo: this.additionalInfoData,
        socialData: this.socialLinkArray,
        profileSrc: this.profileSrc || this.defaultProfile,
        content: this.MockTemplate,
        Arr: Array
      };

    } else {

      data = {
        templateForm: this.basicDetailForm.getRawValue(),
        experienceData: this.workExperienceData,
        careerObjective: this.careerObjForm.get('careerObjective').value,
        educationData: this.educationData,
        skillData: this.skillRatingList,
        additionalInfo: this.additionalInfoData,
        socialData: this.socialLinkArray,
        profileSrc: this.profileSrc,
        content: this.MockTemplate,
        Arr: Array
      };

    }


    this.compileTemplate(data);

  }

  /**
   * Handle datepicker input
   */
  handlePicker(event: MouseEvent, picker: MatDatepicker<moment.Moment>, isTyping = false): void {
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
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
