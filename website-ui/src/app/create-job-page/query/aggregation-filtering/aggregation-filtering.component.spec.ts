import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AggregationFilteringComponent } from './aggregation-filtering.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_QUERY_SERVICE, MOCK_SCHEMA_SERVICE, MOCK_AGGREGATIONS, MOCK_SCHEMA, MOCK_FILTER } from 'src/app/testResources';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';

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
    }).compileComponents();
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

  it('selectAggregtaion selects an aggregation', () => {
    expect(component.aggregationIsSelected).toEqual(false);

    component.queryService.aggregations = MOCK_AGGREGATIONS;
    component.selectAggregation(event, "mock_name1");

    expect(component.aggregationIsSelected).toEqual(true);
  });

  it('selectColumn (string) selects the given column', () => {
    component.availableColumns = [["mock_name", "string"]]
    component.selectColumn(event, "mock_name")

    expect(component.stringColumnIsChosen).toEqual(true);
    expect(component.availableOperators).toEqual(["exclude", "include"]);
    expect(component.availableStringValues).toEqual(MOCK_SCHEMA.schema[0].range);
    expect(component.chosenOperator).toEqual("");
    expect(component.chosenStringValue).toEqual("");
    expect(component.chosenNumericValue).toEqual(undefined);
  });

  it('selectColumn (double) selects the given column', () => {
    component.availableColumns = [["mock_name", "double"]]
    component.selectColumn(event, "mock_name")

    expect(component.stringColumnIsChosen).toEqual(false);
    expect(component.availableOperators).toEqual(["<", "<=", ">", ">=", "=", "!="]);
    expect(component.numericMax).toEqual(10);
    expect(component.numericMin).toEqual(0);

    expect(component.chosenOperator).toEqual("");
    expect(component.chosenStringValue).toEqual("");
    expect(component.chosenNumericValue).toEqual(undefined);
  });

  it('adFilter (string) (include) adds the correct filter', () => {
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
    expect(component.aggregationIsSelected).toEqual(false);
    expect(component.stringColumnIsChosen).toEqual(false);
    expect(component.queryService.aggregationFilters.length).toEqual(1);
    expect(component.queryService.aggregationFilters[0].query).toEqual("mock_name = 'mock_string_value'");
  });

  it('addFilter (string) (exclude) adds the correct filter', () => {
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
    expect(component.aggregationIsSelected).toEqual(false);
    expect(component.stringColumnIsChosen).toEqual(false);
    expect(component.queryService.aggregationFilters.length).toEqual(1);
    expect(component.queryService.aggregationFilters[0].query).toEqual("mock_name != 'mock_string_value'");
  });


  it('addFilter (double) adds the correct filter', () => {
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
    expect(component.aggregationIsSelected).toEqual(false);
    expect(component.stringColumnIsChosen).toEqual(false);
    expect(component.queryService.aggregationFilters.length).toEqual(1);
    expect(component.queryService.aggregationFilters[0].query).toEqual("mock_name = 10");
  });

  it('deleteFilter button registers mongodb service call', () => {
    component.queryService.aggregationFilters = [MOCK_FILTER];
    component.deleteFilter(event, MOCK_FILTER);
    
    expect(component.queryService.aggregationFilters.length).toEqual(0);
  });
});
