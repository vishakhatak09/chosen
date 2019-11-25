import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdditionalModel } from 'core/models/resumebuilder.model';
import { fuseAnimations } from '@fuse/animations';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import 'tinymce/tinymce.min.js';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AppConstant } from 'core/constants/app.constant';
import { DomSanitizer } from '@angular/platform-browser';

declare var tinymce: any;

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: AppConstant.MY_YEAR_FORMATS },
  ],
  animations: fuseAnimations
})
export class AdditionalInfoComponent implements OnInit {

  additionalInfo: AdditionalModel;
  savedAdditionalData: string[] = [];
  additionalText: string;
  separatorKeysCodes: number[] = [ENTER];
  tinyEditorConfig = {};
  editorText;
  certifications: {
    date: Moment,
    certificate: string;
  }[] = [];
  public maxDate = moment();
  blankCertificateData = {
    date: null,
    certificate: '',
  };

  /**
   * Constructor
   * @param dialogRef Dialog Reference
   * @param dialogData Dialog Data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<AdditionalInfoComponent>,
    private domsanitizer: DomSanitizer,
  ) {
    if (this.dialogData) {
      this.additionalInfo = this.dialogData;
    }
  }

  /**
   * On init
   */
  ngOnInit() {

    const type = this.additionalInfo.type.toLowerCase();
    if (type === 'accomplishments' || type === 'affiliations') {
      this.editorText = this.additionalInfo.value;
      this.setupTinyMce();
    } else if (type === 'certifications') {
      if (this.additionalInfo.value && this.additionalInfo.value.length > 0) {
        const certiData: any[] = Array.from(this.additionalInfo.value);
        this.certifications = certiData;
      }
      this.certifications.push(
        this.blankCertificateData
      );
    } else {
      const data: string[] = typeof this.additionalInfo.value === 'object' ? Array.from(this.additionalInfo.value) : [];
      this.savedAdditionalData = data;
    }

  }

  /**
   * Submit form data
   */
  submitForm(): void {
    const type = this.additionalInfo.type.toLowerCase();
    if (type === 'accomplishments' || type === 'affiliations') {
      this.additionalInfo.value = this.editorText;
    } else if (type === 'certifications') {
      this.additionalInfo.value = this.certifications;
    } else {
      this.additionalInfo.value = this.savedAdditionalData;
    }
    this.dialogRef.close(this.additionalInfo);
  }

  /**
   * Add additional info tags
   */
  addValues(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our value
    if ((value || '').trim()) {
      if (!this.savedAdditionalData) {
        this.savedAdditionalData = [];
      }
      this.savedAdditionalData.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.additionalText = '';

  }

  /**
   * Remove additional info tags
   */
  removeValues(index: number): void {
    if (index >= 0) {
      this.savedAdditionalData.splice(index, 1);
    }
  }

  /**
   * Setup tinymce editor
   */
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

  /**
   * On Year Selection
   * @param normalizedYear Selected year
   */
  chosenYearHandler(
    normalizedYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>,
    index: number
  ) {
    const ctrlValue = normalizedYear;
    ctrlValue.year(normalizedYear.year());
    this.certifications[index].date = ctrlValue;
    datepicker.close();
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

  addDeleteCertificate(type: 'add' | 'delete', index = -1): void {
    if (type === 'add') {
      if (this.certifications.length >= 1) {
        const value = this.certifications[this.certifications.length - 1];
        if (value !== undefined && value.certificate !== undefined && value.certificate.trim() === '') {
          return;
        }
      }
      this.certifications.push({
        date: null,
        certificate: '',
      });
    } else {
      if (index !== -1) {
        this.certifications.splice(index, 1);
      }
    }
  }

}
