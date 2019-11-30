import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { TemplatesService } from './templates.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TemplatesComponent implements OnInit, OnDestroy {

  templateUrl = environment.serverBaseUrl + 'api/template/templateList';
  view: string;

  // private
  private _unsubscribeAll: Subject<any> = new Subject();

  templateData = [
    'assets/images/templates/tp-1.png',
    'assets/images/templates/tp-2.png',
    'assets/images/templates/tp-3.png',
    'assets/images/templates/tp-4.png',
    'assets/images/templates/tp-4.png',
    'assets/images/templates/tp-4.png',
    'assets/images/templates/tp-4.png',
    'assets/images/templates/tp-4.png',
  ];

  constructor(
    private router: Router,
    private templatesService: TemplatesService
  ) {
    // Set the defaults
    this.view = 'preview';

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.getTemplateList();
  }

  /**
   * Toggle the view
   */
  toggleView(): void {
    if (this.view === 'preview') {
      this.view = 'source';
    } else {
      this.view = 'preview';
    }
  }

  selectTemplate(): void {
    this.router.navigate(['/user/resumebuilder']);
  }

  getTemplateList(): void {

    this.templatesService.getTemplates(this.templateUrl)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          console.log(response);
        },
        (err) => {
          console.log(err);
        }
      );

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
