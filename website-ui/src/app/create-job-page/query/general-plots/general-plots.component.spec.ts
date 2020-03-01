import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of, Observable } from 'rxjs';
import { GeneralPlotsComponent } from './general-plots.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, mockQueryService, mockSchemaService } from 'src/app/commonDependencies';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { IJobModel } from '../../../../../../mongodb-service/src/models/jobModel';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';

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

// class MockMongodbService {
//   private mockJob: IJobModel = {
//     name: "string",
//     _id: "string",
//     description: "string",
//     rawInputDirectory: "string",
//     stagingFileName: "string",
//     userId: "string",
//     generateESIndices: true,
//     jobStatus: 0,
//   }

//   getJobById() {
//     of(this.mockJob)
//   }
// }

describe('GeneralPlotsComponent', () => {
  let component: GeneralPlotsComponent;
  let fixture: ComponentFixture<GeneralPlotsComponent>;
  // let mockMongodbService: MockMongodbService = new MockMongodbService();

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById"])
  mockMongodbService.getJobById.and.returnValue(of(mockJobs));

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
          useValue: mockQueryService
        },
        {
          provide: SchemaService,
          useValue: mockSchemaService
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
    fixture = TestBed.createComponent(GeneralPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
