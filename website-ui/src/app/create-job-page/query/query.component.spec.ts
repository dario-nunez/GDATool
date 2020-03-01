import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { QueryComponent } from './query.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_SCHEMA_SERVICE, MOCK_JOB, MOCK_AGGREGATIONS } from 'src/app/testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { SchemaService } from 'src/services/schema/schema.service';

describe('QueryComponent', () => {
  let component: QueryComponent;
  let fixture: ComponentFixture<QueryComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById", "createMultipleAggregations"])
  mockMongodbService.getJobById.and.returnValue(of(MOCK_JOB));
  mockMongodbService.createMultipleAggregations.and.returnValue(of(MOCK_AGGREGATIONS));

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
