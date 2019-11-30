import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'core/services/toastr.service';
import 'tinymce/tinymce.min.js';
import { FormControl, Validators } from '@angular/forms';
declare var tinymce: any;

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
  public aboutUsEditor = new FormControl('', [Validators.required]);

  constructor(
    private _toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.setupTinyMce();
  }

  private setupTinyMce(): void {
    tinymce.baseURL = 'assets'; // Need to display proper editor with its its folder in assets folder
    this.tinyEditorConfig = {
      // selector: 'textarea#editorId',
      // skin_url: '/skins', // Or loaded from your environments config
      id: 'aboutUs',
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

  onSubmit() {
    console.log('submitted');
  }

  /**
   * Get selected file images
   * @param files Selected Files
   */
  getFileData(files: FileList): void {
    // console.log('files', files);
    if (files.length > 0 && this.imageFiles.length <= 7) {
      // this.imageFiles = files;
      for (let i = 0; i < files.length; i++) {
        const fileData: File = files[i];
        if (!fileData.type.toLowerCase().includes('image')) {
          this._toastrService.displaySnackBar('Please select only image files', 'error');
          return;
        } else {
          if (this.imageFiles.length < 7) {
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
            });
          } else {
            this._toastrService.displaySnackBar('Only 7 images are allowed to upload', 'error');
            this.hideLoading();
            return;
          }
        }
      }
      this.hideLoading();
      // console.log(this.imageFiles);
    } else if (this.imageFiles.length > 7) {
      this._toastrService.displaySnackBar('You must upload upto 7 images', 'error');
    }
  }

  /**
   * Remove selected image
   * @param index Index
   */
  removeImage(index: number): void {
    this.imageArray.splice(index, 1);
    this.imageFiles.splice(index, 1);
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
