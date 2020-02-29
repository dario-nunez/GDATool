import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationFilteringComponent } from './aggregation-filtering.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS } from 'src/app/commonDependencies';

describe('AggregationFilteringComponent', () => {
  let component: AggregationFilteringComponent;
  let fixture: ComponentFixture<AggregationFilteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
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
