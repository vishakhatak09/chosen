import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentMgmtComponent } from './content-mgmt.component';

describe('ContentMgmtComponent', () => {
  let component: ContentMgmtComponent;
  let fixture: ComponentFixture<ContentMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
