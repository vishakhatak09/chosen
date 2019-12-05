import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'core/services/toastr.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CmsService } from '../cms.service';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-content-mgmt',
  templateUrl: './content-mgmt.component.html',
  styleUrls: ['./content-mgmt.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContentMgmtComponent implements OnInit {

  imageFiles = [];
  imageArray: {
    base64Url: string | ArrayBuffer;
    name: string;
  }[] = [];
  public isLoading = false;
  tinyEditorConfig = {};
  contentForm: FormGroup;
  maxFileLength = 1;
  contentData: any;

  // private
  private _unSubscriber: Subject<any> = new Subject();

  // Apis
  public baseUrl = environment.serverImagePath + 'template/';
  public getContentUrl = environment.serverBaseUrl + 'admin/content/getContent';
  public addContentUrl = environment.serverBaseUrl + 'admin/content/addContent';
  public updateContentUrl = environment.serverBaseUrl + 'admin/content/updateContent';

  constructor(
    private _toastrService: ToastrService,
    private _fb: FormBuilder,
    private _cmsService: CmsService
  ) { }

  // Prevent drag-drop of files in whole page
  @HostListener('drag', ['$event'])
  @HostListener('dragstart', ['$event'])
  @HostListener('dragenter', ['$event'])
  @HostListener('dragover', ['$event'])
  @HostListener('dragleave', ['$event'])
  @HostListener('dragend', ['$event'])
  @HostListener('drop', ['$event'])
  public handleDrop(event: DragEvent) {
    event.preventDefault();
  }
  // Prevent drag-drop of files in whole page

  ngOnInit() {

    this.contentForm = this._fb.group({
      image: [{ value: '', disabled: true }, Validators.required],
      mainText: ['', Validators.required],
      phraseText: ['', Validators.required]
    });

    this.getContent();
  }

  getContent(): void {

    this._cmsService.getContentMgmtData(this.getContentUrl)
      .pipe(takeUntil(this._unSubscriber))
      .subscribe(
        (data) => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );

  }

  onSubmit() {
    console.log('submitted', this.contentForm.value);
    if (this.contentForm.valid) {
      this.showLoading();

      const formValue = this.contentForm.getRawValue();

      const params: any = {
        'params': {
          image: this.imageArray[0].base64Url,
          mainText: formValue.mainText,
          phraseText: formValue.phraseText,
        }
      };

      let api = this.addContentUrl;
      if (this.contentData) {
        params.params.id = this.contentData._id;
        api = this.updateContentUrl;
      }

      this._cmsService.addUpdateContentMgmtData(api, params)
        .pipe(takeUntil(this._unSubscriber))
        .subscribe(
          (response) => {
            console.log('add/update response', response);
            this.hideLoading();
          },
          error => {
            this.hideLoading();
            console.log(error);
          });
    }
  }

  /**
   * Get selected file images
   * @param files Selected Files
   */
  getFileData(files: FileList): void {
    // console.log('files', files);
    if (files.length > 0 && this.imageFiles.length <= this.maxFileLength) {
      // this.imageFiles = files;
      for (let i = 0; i < files.length; i++) {
        const fileData: File = files[i];
        if (!fileData.type.toLowerCase().includes('image')) {
          this._toastrService.displaySnackBar('Please select only image files', 'error');
          return;
        } else {
          if (this.imageFiles.length < this.maxFileLength) {
            this.imageFiles.push(files[i]);
            this.showLoading();
            const reader = new FileReader();
            reader.readAsDataURL(fileData);
            reader.onload = (() => {
              const obj = {
                base64Url: reader.result,
                name: fileData.name,
              };
              this.imageArray.push(obj);
              this.contentForm.get('image').setValue(fileData.name);
            });
          } else {
            this._toastrService.displaySnackBar('Only 1 image is allowed to upload', 'error');
            this.hideLoading();
            return;
          }
        }
      }
      this.hideLoading();
      // console.log(this.imageFiles);
    } else if (this.imageFiles.length > 7) {
      this._toastrService.displaySnackBar('You must upload only 1 image', 'error');
    }
  }

  /**
   * Remove selected image
   * @param index Index
   */
  removeImage(index: number): void {
    this.imageArray.splice(index, 1);
    this.imageFiles.splice(index, 1);
    this.contentForm.get('image').setValue(null);
  }

  showLoading(): void {
    this.isLoading = true;
  }

  hideLoading(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}
