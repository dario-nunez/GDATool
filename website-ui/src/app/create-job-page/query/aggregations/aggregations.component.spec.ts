import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { AggregationsComponent } from './aggregations.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_QUERY_SERVICE, MOCK_SCHEMA_SERVICE, MOCK_JOB } from 'src/app/testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';

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
});
