import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { AggregationsComponent } from './aggregations.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_QUERY_SERVICE, MOCK_SCHEMA_SERVICE, MOCK_JOB, MOCK_AGGREGATIONS } from 'src/app/testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';
import { IAggregationModel } from '../../../../../../mongodb-service/src/models/aggregationModel';

describe('AggregationsComponent', () => {
  let component: AggregationsComponent;
  let fixture: ComponentFixture<AggregationsComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById"])
  mockMongodbService.getJobById.and.returnValue(of(MOCK_JOB));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: MongodbService,
          useValue: mockMongodbService
        },
        {
          provide: QueryService,
          useValue: MOCK_QUERY_SERVICE
        },
        {
          provide: SchemaService,
          useValue: MOCK_SCHEMA_SERVICE
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: 'url', params: {}, queryParams: {}, data: {}, paramMap: {
                get: () => "string"
              }
            },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add default aggregations', () => {
    component.METRIC_COLUMNS = ["price"];
    component.FEATURE_COLUMNS = ["city", "county", "price"];
    const expectedAggregations:IAggregationModel[] = [
      {
        operations: ["COUNT", "SUM", "MAX", "MIN", "AVG"],
        featureColumns: ["city"],
        jobId: MOCK_JOB._id,
        metricColumn: "price",
        name: "Aggregation of price by city",
        sortColumnName: "city"
      },
      {
        operations: ["COUNT", "SUM", "MAX", "MIN", "AVG"],
        featureColumns: ["county"],
        jobId: MOCK_JOB._id,
        metricColumn: "price",
        name: "Aggregation of price by county",
        sortColumnName: "county"
      }
    ]

    component.addDefaultAggregations()

    expect(component.queryService.aggregations).toEqual(expectedAggregations)
  });

  it('crete aggregation unique name', () => {
    const expectedAggregation:IAggregationModel = {
      operations: ["COUNT", "SUM", "MAX", "MIN", "AVG"],
      featureColumns: ["city"],
      jobId: MOCK_JOB._id,
      metricColumn: "price",
      name: "Aggregation of price by city",
      sortColumnName: "city"
    }

    component.selectedOperations = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
    component.selectedFeatureColumns =  ["city"];
    component.jobId = MOCK_JOB._id;
    component.currentAggregationMetricColumn = "price";
    component.currentAggregationName = "Aggregation of price by city";
    component.selectedFeatureColumns = ["city"];

    component.createAggregation();

    expect(component.queryService.aggregations[0]).toEqual(expectedAggregation);
    expect(component.currentAggregationMetricColumn).toEqual("Choose one")
    expect(component.currentAggregationName).toEqual("")
    expect(component.possibleOperations).toEqual(["COUNT", "SUM", "MAX", "MIN", "AVG"])
    expect(component.possibleFeatureColumns).toEqual([])
    expect(component.possibleMetricColumns).toEqual([])
    expect(component.selectedFeatureColumns).toEqual([])
    expect(component.selectedOperations).toEqual([])
  });

  it('crete aggregation existing name', () => {
    component.selectedOperations = ["COUNT", "SUM", "MAX", "MIN", "AVG"];
    component.selectedFeatureColumns =  ["city"];
    component.jobId = MOCK_JOB._id;
    component.currentAggregationMetricColumn = "price";
    component.currentAggregationName = "nope";
    component.selectedFeatureColumns = ["city"];

    component.createAggregation();

    expect(component.currentAggregationName).toEqual("")
  });

  it('add element aggregation new aggregation', () => {
    component.selectedOperations = ["a", "b"];
    component.possibleOperations = ["a", "b", "c"];
    component.addElement(event, "c", "aggregation");
    expect(component.possibleOperations).toEqual(["a", "b"]);
    expect(component.selectedOperations).toEqual(["a", "b", "c"]);
  });

  it('add element aggregation existing aggregation', () => {
    component.selectedOperations = ["a", "b"];
    component.possibleOperations = ["a", "b", "c"];
    component.addElement(event, "a", "aggregation");
    expect(component.possibleOperations).toEqual(["b", "c"]);
    expect(component.selectedOperations).toEqual(["a", "b"]);
  });

  it('add element feature new feature', () => {
    component.selectedFeatureColumns = ["a", "b"];
    component.possibleFeatureColumns = ["a", "b", "c"];
    component.addElement(event, "c", "feature");
    expect(component.possibleFeatureColumns).toEqual(["a", "b"]);
    expect(component.selectedFeatureColumns).toEqual(["a", "b", "c"]);
  });

  it('add element feature existing feature', () => {
    component.selectedFeatureColumns = ["a", "b"];
    component.possibleFeatureColumns = ["a", "b", "c"];
    component.addElement(event, "a", "feature");
    expect(component.possibleFeatureColumns).toEqual(["b", "c"]);
    expect(component.selectedFeatureColumns).toEqual(["a", "b"]);
  });
  
  it('remove element aggregation existing aggregation', () => {
    component.selectedOperations = ["a", "b", "c"];
    component.possibleOperations = ["a", "b"];
    component.removeElement(event, "c", "aggregation");
    expect(component.possibleOperations).toEqual(["a", "b", "c"]);
    expect(component.selectedOperations).toEqual(["a", "b"]);
  });

  it('remove element aggregation non existing aggregation', () => {
    component.selectedOperations = ["a", "b", "c"];
    component.possibleOperations = ["a", "b"];
    component.removeElement(event, "b", "aggregation");
    expect(component.possibleOperations).toEqual(["a", "b"]);
    expect(component.selectedOperations).toEqual(["a", "c"]);
  });

  it('remove element feature existing feature', () => {
    component.selectedFeatureColumns = ["a", "b", "c"];
    component.possibleFeatureColumns = ["a", "b"];
    component.removeElement(event, "c", "feature");
    expect(component.possibleFeatureColumns).toEqual(["a", "b", "c"]);
    expect(component.selectedFeatureColumns).toEqual(["a", "b"]);
  });

  it('remove element feature non existing feature', () => {
    component.selectedFeatureColumns = ["a", "b", "c"];
    component.possibleFeatureColumns = ["a", "b"];
    component.removeElement(event, "b", "feature");
    expect(component.possibleFeatureColumns).toEqual(["a", "b"]);
    expect(component.selectedFeatureColumns).toEqual(["a", "c"]);
  });

  it('select metric column', () => {
    component.FEATURE_COLUMNS = ["a", "b", "c"];
    component.selectMetricColumn(event, "a");

    expect(component.possibleFeatureColumns).toEqual(["b", "c"]);
    expect(component.metricSelected).toEqual(true);
  });

  it('delete aggregation', () => {
    component.queryService.aggregations = MOCK_AGGREGATIONS;
    component.deleteAggregation(event, MOCK_AGGREGATIONS[0]);
    expect(component.queryService.aggregations).toEqual([MOCK_AGGREGATIONS[1]]);
  });
});
