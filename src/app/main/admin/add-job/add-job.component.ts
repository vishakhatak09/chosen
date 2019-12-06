import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddJobComponent implements OnInit {

  public isLoading = false;
  addJobForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.addJobForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      // location: ['', Validators.required],
    });

  }

  onSubmit(): void {

  }

}
