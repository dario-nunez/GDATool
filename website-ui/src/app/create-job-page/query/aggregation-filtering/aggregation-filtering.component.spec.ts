import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationFilteringComponent } from './aggregation-filtering.component';

describe('AggregationFilteringComponent', () => {
  let component: AggregationFilteringComponent;
  let fixture: ComponentFixture<AggregationFilteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregationFilteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
