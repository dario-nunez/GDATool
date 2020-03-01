import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AggregationFilteringComponent } from './aggregation-filtering.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_QUERY_SERVICE, MOCK_SCHEMA_SERVICE, MOCK_AGGREGATIONS, MOCK_SCHEMA, MOCK_FILTER } from 'src/app/testResources';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';
import { IAggregationModel } from '../../../../../../mongodb-service/src/models/aggregationModel';

describe('AggregationFilteringComponent', () => {
  let component: AggregationFilteringComponent;
  let fixture: ComponentFixture<AggregationFilteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: QueryService,
          useValue: MOCK_QUERY_SERVICE
        },
        {
          provide: SchemaService,
          useValue: MOCK_SCHEMA_SERVICE
        }
      ]
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
    expect(component.queryService.aggregationFilters).toEqual([]);
    expect(component.selectedAggregation).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");

    component.schemaService.featureColumns = [["f1", "f1_type"], ["f2", "f2_type"]]
    component.schemaService.metricColumns = [["f1", "f1_type"]]
  
    expect(component.FEATURE_COLUMNS).toEqual([]);
    expect(component.METRIC_COLUMNS).toEqual([]);
    expect(component.availableColumns).toEqual([]);
  });

  it('select aggregtaion', () => {
    expect(component.aggregationSelected).toEqual(false);
    component.queryService.aggregations = MOCK_AGGREGATIONS;
    const expected = MOCK_AGGREGATIONS[0];
    component.selectAggregation(event, "mock_name1");
    expect(component.aggregationSelected).toEqual(true);
  });

  it('select column string', () => {
    component.availableColumns = [["mock_name", "string"]]
    component.selectColumn(event, "mock_name")
    expect(component.stringColumnChosen).toEqual(true);
    expect(component.availableOperators).toEqual(["exclude", "include"]);
    expect(component.availableStringValues).toEqual(MOCK_SCHEMA.schema[0].range);

    expect(component.chosenOperator).toEqual("");
    expect(component.chosenStringValue).toEqual("");
    expect(component.chosenNumericValue).toEqual(undefined);
  });

  it('select column double', () => {
    component.availableColumns = [["mock_name", "double"]]
    component.selectColumn(event, "mock_name")
    expect(component.stringColumnChosen).toEqual(false);
    expect(component.availableOperators).toEqual(["<", "<=", ">", ">=", "=", "!="]);
    expect(component.numericMax).toEqual(10);
    expect(component.numericMin).toEqual(0);

    expect(component.chosenOperator).toEqual("");
    expect(component.chosenStringValue).toEqual("");
    expect(component.chosenNumericValue).toEqual(undefined);
  });

  it('add filter string include', () => {
    component.availableColumns = [["mock_name", "string"]]
    component.chosenIdentifierColumn = "mock_name"; 
    component.queryService.aggregations = MOCK_AGGREGATIONS;
    const expected = MOCK_AGGREGATIONS[0];
    component.selectedAggregation = expected.name;
    component.chosenStringValue = "mock_string_value";
    component.chosenOperator = "include";
    component.addFilter();

    expect(component.selectedAggregation).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");
    expect(component.chosenOperator).toEqual("");
    expect(component.chosenStringValue).toEqual("");
    expect(component.chosenNumericValue).toEqual(undefined);
    expect(component.numericMin).toEqual(undefined);
    expect(component.numericMax).toEqual(undefined);
    
    expect(component.aggregationSelected).toEqual(false);
    expect(component.stringColumnChosen).toEqual(false);

    expect(component.queryService.aggregationFilters.length).toEqual(1);
    expect(component.queryService.aggregationFilters[0].query).toEqual("mock_name = 'mock_string_value'");
  });

  it('add filter string exclude', () => {
    component.availableColumns = [["mock_name", "string"]]
    component.chosenIdentifierColumn = "mock_name"; 
    component.queryService.aggregations = MOCK_AGGREGATIONS;
    const expected = MOCK_AGGREGATIONS[0];
    component.selectedAggregation = expected.name;
    component.chosenStringValue = "mock_string_value";
    component.chosenOperator = "exclude";
    component.addFilter();

    expect(component.selectedAggregation).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");
    expect(component.chosenOperator).toEqual("");
    expect(component.chosenStringValue).toEqual("");
    expect(component.chosenNumericValue).toEqual(undefined);
    expect(component.numericMin).toEqual(undefined);
    expect(component.numericMax).toEqual(undefined);

    expect(component.aggregationSelected).toEqual(false);
    expect(component.stringColumnChosen).toEqual(false);

    expect(component.queryService.aggregationFilters.length).toEqual(1);
    expect(component.queryService.aggregationFilters[0].query).toEqual("mock_name != 'mock_string_value'");
  });


  it('add filter double', () => {
    component.availableColumns = [["mock_name", "double"]]
    component.chosenIdentifierColumn = "mock_name"; 
    component.queryService.aggregations = MOCK_AGGREGATIONS;
    const expected = MOCK_AGGREGATIONS[0];
    component.selectedAggregation = expected.name;
    component.chosenNumericValue = 10;
    component.chosenOperator = "=";
    component.addFilter();

    expect(component.selectedAggregation).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");
    expect(component.chosenOperator).toEqual("");
    expect(component.chosenStringValue).toEqual("");
    expect(component.chosenNumericValue).toEqual(undefined);
    expect(component.numericMin).toEqual(undefined);
    expect(component.numericMax).toEqual(undefined);

    expect(component.aggregationSelected).toEqual(false);
    expect(component.stringColumnChosen).toEqual(false);

    expect(component.queryService.aggregationFilters.length).toEqual(1);
    expect(component.queryService.aggregationFilters[0].query).toEqual("mock_name = 10");
  });

  it('delete filter', () => {
    component.queryService.aggregationFilters = [MOCK_FILTER];
    component.deleteFilter(event, MOCK_FILTER);
    expect(component.queryService.aggregationFilters.length).toEqual(0);
  });
});
