import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AggregationClusteringComponent } from './aggregation-clustering.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from 'src/app/testResources';

describe('AggregationClusteringComponent', () => {
  let component: AggregationClusteringComponent;
  let fixture: ComponentFixture<AggregationClusteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
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
