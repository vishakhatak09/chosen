import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
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
import { map } from 'rxjs/operators';
import { SkillWithBox, SkillRating } from 'core/models/resumebuilder.model';

@Component({
  selector: 'app-resumebuilder',
  templateUrl: './resumebuilder.component.html',
  styleUrls: ['./resumebuilder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResumebuilderComponent implements OnInit, OnDestroy {

  public defaultProfile = environment.baseUrl + 'assets/images/avatars/profile.jpg';
  public basicDetailForm: FormGroup;
  maxDate = new Date();
  maritalStatus: OptionType[] = AppConstant.MaritalStatusOptions;
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
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
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

  // Private
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _formBuilder: FormBuilder
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {

    this.basicDetailForm = this._formBuilder.group({
      fullName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      fullAddress: ['', [Validators.required]],
      dateOfBirth: [{ value: '', disabled: true }, [Validators.required]],
      placeOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      linkedInUrl: ['', [Validators.pattern(AppConstant.ValidUrlPattern)]],
      twitterUrl: ['', [Validators.pattern(AppConstant.ValidUrlPattern)]],
      careerObjective: ['', [Validators.required]],
      professionalExperience: ['', [Validators.required]],
      educationHistory: ['', [Validators.required]],
      languages: ['', []],
      references: ['', []],
      skillType: ['', []],
      ratingType: [this.ratingStyle, []],
    });

    this.filteredLanguages = this.basicDetailForm.get('languages').valueChanges.pipe(
      // startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.languagesList.slice()));

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Methods
  // -----------------------------------------------------------------------------------------------------

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.languagesList.filter(lang => lang.toLowerCase().includes(filterValue));
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  formSubmit(): void {
    console.log(this.basicDetailForm);
    console.log('skillListBox', this.skillListBox);
    console.log('skillRatingList', this.skillRatingList);
  }

  addLang(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
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

  removeLang(fruit: string): void {
    const index = this.selectedLanguages.indexOf(fruit);

    if (index >= 0) {
      this.selectedLanguages.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    const index = this.languagesList.indexOf(value);
    const selected = this.selectedLanguages.indexOf(value);
    if (index !== -1 && selected === -1) {
      this.selectedLanguages.push(value.trim());
    }
    this.basicDetailForm.get('languages').setValue(null);
  }

  addSkill(skillInput: HTMLInputElement, type: 'box' | 'box-rating' = 'box') {
    if ( skillInput && skillInput.value ) {
      const value = skillInput.value.trim().toLowerCase();
      if ( type === 'box' ) {
        const element = {
          skillName: value,
        };
        const duplicate = this.skillListBox.find((s: SkillWithBox) => s.skillName === value);
        if ( duplicate === undefined ) {
          this.skillListBox.push(element);
          skillInput.value = '';
        }
      } else {
        const element = {
          skillName: value,
          ratings: 0,
        };
        const duplicate = this.skillRatingList.find((s: SkillRating) => s.skillName === value);
        if ( duplicate === undefined ) {
          this.skillRatingList.push(element);
          skillInput.value = '';
        }

      }
    }
  }

  removeSkill(index: number, type: 'box' | 'box-rating' = 'box') {
    if ( index ) {
      if ( type === 'box' ) {
        this.skillListBox.splice(index, 1);
      } else {
        this.skillRatingList.splice(index, 1);
      }
    }
  }

  skillTypeSelecttion(seletedSkill: 'basic' | 'withBox' | 'withRating'): void {
    this.skillListBox = [];
    this.skillRatingList = [];
    this.basicSkill = '';
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
