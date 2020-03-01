import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { QueryComponent } from './query.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_SCHEMA_SERVICE } from 'src/app/testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { IJobModel } from '../../../../../mongodb-service/src/models/jobModel';
import { SchemaService } from 'src/services/schema/schema.service';
import { ISchema } from 'src/models/schema.model';
import { IColumn } from 'src/models/column.model';
import { IAggregationModel } from '../../../../../mongodb-service/src/models/aggregationModel';

const mockJobs: IJobModel = {
  name: "string",
  _id: "string",
  description: "string",
  rawInputDirectory: "string",
  stagingFileName: "string",
  userId: "string",
  generateESIndices: true,
  jobStatus: 0
}

const mockColumn: IColumn = {
  name: "mock_column",
  type: "mock_type",
  range: ["1", "10"]
}

const mockSchema: ISchema = {
  datasetName: "mock_dataset_name",
  schema: [mockColumn]
}

const mockAggregations: IAggregationModel[] = [
  {
    _id: "mock_id",
    aggs: [],
    featureColumns: [],
    jobId: "mock_jobId",
    metricColumn: "mock_metricColumn",
    name: "mock_name",
    sortColumnName: "mock_sortColumnName"
  }
]

describe('QueryComponent', () => {
  let component: QueryComponent;
  let fixture: ComponentFixture<QueryComponent>;

  // Mongodb service
  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById", "createMultipleAggregations"])
  mockMongodbService.getJobById.and.returnValue(of(mockJobs));
  mockMongodbService.createMultipleAggregations.and.returnValue(of(mockAggregations));

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
    fixture = TestBed.createComponent(QueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
