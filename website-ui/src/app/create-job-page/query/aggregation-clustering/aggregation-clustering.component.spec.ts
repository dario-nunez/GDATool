import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationClusteringComponent } from './aggregation-clustering.component';

describe('AggregationClusteringComponent', () => {
  let component: AggregationClusteringComponent;
  let fixture: ComponentFixture<AggregationClusteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregationClusteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
