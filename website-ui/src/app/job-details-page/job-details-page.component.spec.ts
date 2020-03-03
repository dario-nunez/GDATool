import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { JobDetailsPageComponent } from './job-details-page.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_JOB } from '../testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';

describe('JobDetailsPageComponent', () => {
  let component: JobDetailsPageComponent;
  let fixture: ComponentFixture<JobDetailsPageComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById", "updateJob", "deleteJobRecusrive"])
  mockMongodbService.getJobById.and.returnValue(of(MOCK_JOB));
  mockMongodbService.deleteJobRecusrive.and.returnValue(of(MOCK_JOB));
  mockMongodbService.updateJob.and.returnValue(of(MOCK_JOB));

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
    localStorage.setItem("user", JSON.stringify("user"));
    fixture = TestBed.createComponent(JobDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get job', () => {
    component.getJob();
    expect(component.mongodbService.getJobById).toHaveBeenCalled();
  });

  it('update job', () => {
    component.updateJob();
    expect(component.mongodbService.updateJob).toHaveBeenCalled();
  });

  it('delete job', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteJob();
    expect(component.mongodbService.deleteJobRecusrive).toHaveBeenCalled();
  });
});
