import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { ExecuteComponent } from './execute.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_JOB } from 'src/app/testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';

describe('ExecuteComponent', () => {
  let component: ExecuteComponent;
  let fixture: ComponentFixture<ExecuteComponent>;
  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById", "updateJob", "deleteJobRecusrive"])
  mockMongodbService.getJobById.and.returnValue(of(MOCK_JOB));
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
            params: observableOf("job_ID"),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitAndRun button registers mongodb-service call', () => {
    component.submitAndRun();
    expect(component.mongodbService.updateJob).toHaveBeenCalled();
  });

  it('deleteJob registers mongodb-service call', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteJob();
    expect(component.mongodbService.deleteJobRecusrive).toHaveBeenCalled();
  });
});
