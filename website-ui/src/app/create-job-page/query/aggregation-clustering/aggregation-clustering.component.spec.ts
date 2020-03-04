import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AggregationClusteringComponent } from './aggregation-clustering.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_QUERY_SERVICE, MOCK_CLUSTER, MOCK_AGGREGATIONS } from 'src/app/testResources';
import { QueryService } from 'src/services/query/query.service';

describe('AggregationClusteringComponent', () => {
  let component: AggregationClusteringComponent;
  let fixture: ComponentFixture<AggregationClusteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: QueryService,
          useValue: MOCK_QUERY_SERVICE
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.queryService.aggregationClusters.length).toEqual(0);
    expect(component.selectedAggregation).toEqual("");
    expect(component.chosenXColumn).toEqual("");
    expect(component.chosenYColumn).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");
  });

  it('selectXColumn selects the given element', () => {
    component.OPERATIONS = ["a", "b", "c"]
    component.selectXColumn(event, "a");

    expect(component.yAvailableColumns).toEqual(["b", "c"]);
  });

  it('selectYColumn selects the given element', () => {
    component.OPERATIONS = ["a", "b", "c"]
    component.selectYColumn(event, "a");

    expect(component.xAvailableColumns).toEqual(["b", "c"]);
  });

  it('selectAggregtaion selects the given aggregation', () => {
    expect(component.aggregationIsSelected).toEqual(false);

    component.queryService.aggregations = MOCK_AGGREGATIONS;
    const expected = MOCK_AGGREGATIONS[0];
    component.selectAggregation(event, "mock_name1");

    expect(component.OPERATIONS).toEqual(expected.operations);
    expect(component.xAvailableColumns).toEqual(expected.operations);
    expect(component.yAvailableColumns).toEqual(expected.operations);
    expect(component.FEATURE_COLUMNS).toEqual(expected.featureColumns);
    expect(component.aggregationIsSelected).toEqual(true);
  });

  it('addCluster adds the given cluster', () => {
    component.OPERATIONS = ["a", "b"];
    component.queryService.aggregations = MOCK_AGGREGATIONS;
    component.selectedAggregation = "mock_name1";
    component.chosenIdentifierColumn = "mock_identifier"
    component.chosenXColumn = "mock_x"
    component.chosenYColumn = "mock_y"
    component.addCluster();

    expect(component.queryService.aggregationClusters[0]).toEqual(MOCK_CLUSTER);
    expect(component.yAvailableColumns).toEqual(["a", "b"]);
    expect(component.xAvailableColumns).toEqual(["a", "b"]);
    expect(component.chosenXColumn).toEqual("");
    expect(component.chosenYColumn).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");
    expect(component.selectedAggregation).toEqual("");
    expect(component.aggregationIsSelected).toEqual(false);
  });

  it('deleteCluster deletes the given cluster', () => {
    component.queryService.aggregationClusters = [MOCK_CLUSTER];
    component.deleteCluster(event, MOCK_CLUSTER);
    
    expect(component.queryService.aggregationClusters.length).toEqual(0);
  });
});
