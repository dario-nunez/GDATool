import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { UploadComponent } from './upload.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_JOB } from 'src/app/testResources';
import { ActivatedRoute } from '@angular/router';
import { MongodbService } from 'src/services/mongodb/mongodb.service';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById", "getUploadFileUrl", "updateJob", "deleteJobRecusrive"])
  mockMongodbService.getJobById.and.returnValue(of(MOCK_JOB));
  mockMongodbService.getUploadFileUrl.and.returnValue(of({}));
  mockMongodbService.updateJob.and.returnValue(of(MOCK_JOB));
  mockMongodbService.deleteJobRecusrive.and.returnValue(of(MOCK_JOB));

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
    expect(component.mongodbService.getJobById).toHaveBeenCalled();
  });

  it('next', () => {
    component.next();
    expect(component.mongodbService.updateJob).toHaveBeenCalled();
  });

  it('delete job', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteJob();
    expect(component.mongodbService.deleteJobRecusrive).toHaveBeenCalled();
  });
});
