import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusLineComponent } from './status-line.component';

describe('StatusLineComponent', () => {
  let component: StatusLineComponent;
  let fixture: ComponentFixture<StatusLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
