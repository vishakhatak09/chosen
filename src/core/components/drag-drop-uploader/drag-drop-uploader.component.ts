import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-drag-drop-uploader',
  templateUrl: './drag-drop-uploader.component.html',
  styleUrls: ['./drag-drop-uploader.component.scss']
})
export class DragDropUploaderComponent implements OnInit {

  public form: FormGroup;
  @Output()
  selectFile: EventEmitter<FileList> = new EventEmitter();

  constructor(private builder: FormBuilder) {
    this.form = this.builder.group({
      files: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  public submit(files: FileList) {
    this.selectFile.emit(files);
  }


}
