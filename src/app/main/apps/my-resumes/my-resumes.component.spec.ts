import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResumesComponent } from './my-resumes.component';

describe('MyResumesComponent', () => {
  let component: MyResumesComponent;
  let fixture: ComponentFixture<MyResumesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyResumesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyResumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
