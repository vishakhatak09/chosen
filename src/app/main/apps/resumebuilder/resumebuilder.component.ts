import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { fuseAnimations } from '@fuse/animations';
import { AppConstant, OptionType } from 'core/constants/app.constant';
import { LanguageList } from 'core/constants/locale';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { SkillWithBox, SkillRating, WorkModel, EducationModel } from 'core/models/resumebuilder.model';
import { MatDialog } from '@angular/material/dialog';
import { ResumeTemplateComponent } from './resume-template/resumetemplate.component';
import { ResumeBuilderService } from './resumebuilder.service';
import jsPDF from 'jspdf';
import { AddWorkComponent } from './add-work/add-work.component';
import { AddEducationComponent } from './add-education/add-education.component';
import { ConfirmationDialogComponent } from './confirmation/confirmation.component';

@Component({
  selector: 'app-resumebuilder',
  templateUrl: './resumebuilder.component.html',
  styleUrls: ['./resumebuilder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResumebuilderComponent implements OnInit, OnDestroy, AfterViewInit {

  public defaultProfile = environment.baseUrl + 'assets/images/avatars/profile.jpg';
  public profileSrc: string | ArrayBuffer = this.defaultProfile;
  public basicDetailForm: FormGroup;
  public careerObjForm: FormGroup;
  // public eduForm: FormGroup;
  maxDate = new Date();
  maritalStatuOpts: OptionType[] = AppConstant.MaritalStatusOptions;
  genderOptions: OptionType[] = AppConstant.GenderOptions;
  baseUrl = environment.baseUrl;
  public Editor = DecoupledEditor;
  // @ViewChild('myckeditor', {static: false}) ckeditor: any;
  config = {
    uiColor: '#F0F3F4',
    height: '100%',
    placeholder: 'Enter your data here...'
  };
  languagesList: string[] = LanguageList.list;
  filteredLanguages: Observable<string[]>;
  selectedLanguages: string[] = [];
  maxRate = 5;
  currentRate = 0;
  ratingStyle = 'square';
  skillOptions: OptionType[] = AppConstant.SkillCustomOptions;
  basicSkill = '';
  skillconfig = {
    uiColor: '#F0F3F4',
    height: '100%',
    placeholder: 'Enter your skills.'
  };
  skillListBox: SkillWithBox[] = [];
  skillRatingList: SkillRating[] = [];
  ratingThemeList: OptionType[] = AppConstant.RatingThemes;

  tinyEditorConfig = {};
  workExperienceData: WorkModel[] = [];
  educationData: EducationModel[] = [];

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('templateContent', { static: false }) templateContent: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();
  skillForm: FormGroup;

  /**
   * Constructor
   * @param _formBuilder FormBuilder
   * @param matDialog MatDialog
   */
  constructor(
    private _formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private resumeBuilderService: ResumeBuilderService,
    private cdRef: ChangeDetectorRef
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
      email: ['', [Validators.required, Validators.email]],
      fullAddress: ['', [Validators.required]],
      dateOfBirth: [{ value: '', disabled: true }, []],
      placeOfBirth: ['', []],
      maritalStatus: ['', []],
      gender: ['', []],
      // linkedInUrl: ['', [Validators.pattern(AppConstant.ValidUrlPattern)]],
      // twitterUrl: ['', [Validators.pattern(AppConstant.ValidUrlPattern)]],
      // careerObjective: ['', [Validators.required]],
      // professionalExperience: [{ value: '', disabled: false }, [Validators.required]],
      // educationHistory: ['', [Validators.required]],
      // languages: ['', []],
      // references: ['', []],
      // skillType: ['', [Validators.required]],
      // ratingType: [this.ratingStyle, []],
    });

    this.careerObjForm = this._formBuilder.group({
      careerObjective: ['', [Validators.required]],
    });

    // this.workForm = this._formBuilder.group({
    //   professionalExperience: [{ value: '', disabled: false }, [Validators.required]],
    // });

    // this.eduForm = this._formBuilder.group({
    //   educationHistory: [{ value: '', disabled: false }, [Validators.required]],
    // });

    this.skillForm = this._formBuilder.group({
      skillType: ['', [Validators.required]],
      ratingType: [this.ratingStyle, []],
    });

    // this.filteredLanguages = this.basicDetailForm.get('languages').valueChanges.pipe(
    //   // startWith(null),
    //   map((fruit: string | null) => fruit ? this._filter(fruit) : this.languagesList.slice()));

  }

  ngAfterViewInit(): void {

    this.tinyEditorConfig = {
      base_url: '/tinymce', // Root for resources
      suffix: '.min',       // Suffix to use when loading resources
      plugins: 'lists advlist',
      toolbar: 'bold italic underline | bullist numlist |  undo redo',
      height: 300,
      menubar: false,
    };
    this.cdRef.detectChanges();

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Language filter event
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.languagesList.filter(lang => lang.toLowerCase().includes(filterValue));
  }

  /**
   * Ckeditor ready event
   * @param editor Ckeditor
   */
  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  /**
   * On form submit
   */
  formSubmit(): void {
    console.log(this.basicDetailForm.getRawValue());
    console.log('skillListBox', this.skillListBox);
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
   * Adding skills
   * @param skillInput Skill data
   * @param type Skill type
   */
  addSkill(skillInput: HTMLInputElement, type: 'box' | 'box-rating' = 'box') {
    if (skillInput && skillInput.value) {
      const value = skillInput.value.trim().toLowerCase();
      if (type === 'box') {
        const element = {
          skillName: value,
        };
        const duplicate = this.skillListBox.find((s: SkillWithBox) => s.skillName === value);
        if (duplicate === undefined) {
          this.skillListBox.push(element);
          skillInput.value = '';
        }
      } else {
        const element = {
          skillName: value,
          ratings: 0,
        };
        const duplicate = this.skillRatingList.find((s: SkillRating) => s.skillName === value);
        if (duplicate === undefined) {
          this.skillRatingList.push(element);
          skillInput.value = '';
        }

      }
    }
  }

  /**
   * On removing skill
   * @param index Skill index
   * @param type Skill type
   */
  removeSkill(index: number, type: 'box' | 'box-rating' = 'box') {
    if (index) {
      if (type === 'box') {
        this.skillListBox.splice(index, 1);
      } else {
        this.skillRatingList.splice(index, 1);
      }
    }
  }

  /**
   * On change of skill type
   * @param seletedSkill 'basic' | 'withBox' | 'withRating'
   */
  skillTypeSelecttion(seletedSkill: 'basic' | 'withBox' | 'withRating'): void {
    this.skillListBox = [];
    this.skillRatingList = [];
    this.basicSkill = '';
  }

  templatePreview(): void {
    const data = {
      templateForm: this.basicDetailForm.getRawValue(),
      careerObjective: this.careerObjForm.get('careerObjective').value,
      experienceData: this.workExperienceData,
    };
    const dialogRef = this.matDialog.open(
      ResumeTemplateComponent,
      {
        width: 'auto',
      }
    );
    dialogRef.afterOpened().subscribe(() => {
      this.resumeBuilderService.templateData.next(data);
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.resumeBuilderService.templateData.next(null);
    });
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
      });
    } else {
      this.profileSrc = this.defaultProfile;
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

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

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
