import { Component, ViewEncapsulation } from '@angular/core';
import * as shape from 'd3-shape';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TemplatesComponent {

  view: string;

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
    private router: Router
  ) {
    // Set the defaults
    this.view = 'preview';

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
    this.router.navigate(['/apps/resumebuilder']);
  }

}
