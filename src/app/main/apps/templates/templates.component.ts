import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { TemplatesService } from './templates.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AdminTemplateModel } from 'core/models/admin-template.model';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TemplatesComponent implements OnInit, OnDestroy {

  public baseUrl = environment.serverImagePath + 'template/';
  templateUrl = environment.serverBaseUrl + 'api/template/templateList';
  view: string;

  // private
  private _unsubscribeAll: Subject<any> = new Subject();

  templateData: AdminTemplateModel[] = [];

  constructor(
    private router: Router,
    private templatesService: TemplatesService
  ) {
    // Set the defaults
    this.view = 'preview';
    localStorage.removeItem('selected');
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

  selectTemplate(item: AdminTemplateModel): void {
    if (item) {
      localStorage.setItem('selected', item.templateKey.toLowerCase());
      this.router.navigate(['/user/' + item._id + '/resumebuilder']);
    }
  }

  getTemplateList(): void {

    this.templatesService.getTemplates(this.templateUrl)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          if (response.data) {
            this.templateData = response.data;
          }
        },
        (err) => {
          // console.log(err);
        }
      );

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
