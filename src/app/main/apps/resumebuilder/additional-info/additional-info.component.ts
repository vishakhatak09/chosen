import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdditionalModel } from 'core/models/resumebuilder.model';
import { fuseAnimations } from '@fuse/animations';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import 'tinymce';
import { Moment } from 'moment';
declare var tinymce: any;

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
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

  /**
   * Constructor
   * @param dialogRef Dialog Reference
   * @param dialogData Dialog Data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<AdditionalInfoComponent>,
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
    if (type === 'accomplishments' || type === 'affiliations' || type === 'certifications') {
      this.editorText = this.additionalInfo.value;
      this.setupTinyMce();
    } else {
      this.savedAdditionalData = this.additionalInfo.value;
    }

  }

  /**
   * Submit form data
   */
  submitForm(): void {
    const type = this.additionalInfo.type.toLowerCase();
    if (type === 'accomplishments' || type === 'affiliations' || type === 'certifications') {
      this.additionalInfo.value = this.editorText;
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

}
