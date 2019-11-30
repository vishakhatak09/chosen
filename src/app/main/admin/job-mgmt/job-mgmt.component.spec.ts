import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobMgmtComponent } from './job-mgmt.component';

describe('JobMgmtComponent', () => {
  let component: JobMgmtComponent;
  let fixture: ComponentFixture<JobMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
