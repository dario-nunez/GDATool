import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { UploadComponent } from './upload.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from 'src/app/commonDependencies';
import { ActivatedRoute } from '@angular/router';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { IJobModel } from '../../../../../mongodb-service/src/models/jobModel';

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

const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById"])
mockMongodbService.getJobsByUserId.and.returnValue(of(mockJobs));

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

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
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
