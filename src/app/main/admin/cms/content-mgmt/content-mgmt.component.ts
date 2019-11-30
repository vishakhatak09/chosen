import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-content-mgmt',
  templateUrl: './content-mgmt.component.html',
  styleUrls: ['./content-mgmt.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContentMgmtComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
