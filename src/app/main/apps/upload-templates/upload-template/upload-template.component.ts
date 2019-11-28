import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import 'tinymce/tinymce.min.js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { UploadTemplateService } from './upload-template.service';
import { AdminTemplateModel } from 'core/models/admin-template.model';
declare var tinymce: any;

@Component({
  selector: 'upload-template',
  templateUrl: './upload-template.component.html',
  styleUrls: ['./upload-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UploadTemplateComponent implements OnInit, OnDestroy {

  public templateSrc: string | ArrayBuffer;
  public templateFileName: string;
  tinyEditorConfig = {};
  uploadTemplateForm: FormGroup;
  public createTemplateApi = environment.serverBaseUrl + 'admin/template/create';
  public updateTemplateApi = environment.serverBaseUrl + 'admin/template/create';
  public singleTemplateApi = environment.serverBaseUrl + 'admin/template/singleTemplate';
  public isLoading = false;
  editTemplateId: string;
  editTemplateData: AdminTemplateModel;

  subscriptions: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _uploadTemplateService: UploadTemplateService
  ) {
    this.editTemplateId = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.uploadTemplateForm = this._formBuilder.group({
      templateImage: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      templateHtml: ['', [Validators.required]],
    });

    this.setupTinyMce();
    if (this.editTemplateId) {
      this.getEditData();
    }
  }

  getEditData(): void {

    const params = {
      params: {
        templateId: this.editTemplateId,
      }
    };

    this._uploadTemplateService.getSingleTemplateData(this.singleTemplateApi, params)
      .subscribe(
        (response) => {
          if (response && response.code === 200) {
            if (response.data) {
              this.editTemplateData = response.data;
              this.uploadTemplateForm.setValue({
                templateImage: this.editTemplateData.image,
                title: this.editTemplateData.title,
                description: this.editTemplateData.description,
                templateHtml: this.editTemplateData.html,
              });
            }
          }
        },
        (error) => { }
      );

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
        this.templateSrc = reader.result;
        this.templateFileName = fileData.name;
      });
    } else {
      this.templateSrc = null;
      this.templateFileName = null;
    }
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

  goToListing(): void {
    this._router.navigate(['/apps/admin/template-list']);
  }

  onSubmit(): void {
    const formValue = this.uploadTemplateForm.value;
    console.log(formValue);
    if (this.uploadTemplateForm.valid) {

      this.isLoading = true;
      let imageName = this.templateFileName;
      let templatePhoto = this.templateSrc;
      if (this.editTemplateId && !this.templateFileName) {
        imageName = this.editTemplateData.image;
      }
      if (this.editTemplateId && !this.templateSrc) {
        templatePhoto = this.editTemplateData.image;
      }

      const params = {
        'params': {
          'imageName': imageName,
          'photo': templatePhoto,
          'title': formValue.title,
          'description': formValue.description,
          'html': formValue.templateHtml
        }
      };

      let currentApi = this.createTemplateApi;
      if (this.editTemplateId) {
        currentApi = this.updateTemplateApi;
      }

      this.subscriptions = this._uploadTemplateService.createUpdateTemplate(currentApi, params)
        .subscribe(
          (response) => {
            console.log(response);
            this.isLoading = false;
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );

    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

}
