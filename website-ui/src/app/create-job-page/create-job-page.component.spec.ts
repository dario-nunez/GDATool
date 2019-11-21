import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobPageComponent } from './create-job-page.component';

describe('CreateJobPageComponent', () => {
  let component: CreateJobPageComponent;
  let fixture: ComponentFixture<CreateJobPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJobPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
