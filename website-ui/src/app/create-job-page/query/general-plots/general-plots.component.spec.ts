import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPlotsComponent } from './general-plots.component';

describe('GeneralPlotsComponent', () => {
  let component: GeneralPlotsComponent;
  let fixture: ComponentFixture<GeneralPlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralPlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
