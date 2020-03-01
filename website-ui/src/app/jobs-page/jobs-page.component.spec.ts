import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { JobsPageComponent } from './jobs-page.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_JOBS } from '../testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';

describe('JobsPageComponent', () => {
  let component: JobsPageComponent;
  let fixture: ComponentFixture<JobsPageComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobsByUserId"])
  mockMongodbService.getJobsByUserId.and.returnValue(of(MOCK_JOBS));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: MongodbService,
          useValue: mockMongodbService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify("user"));
    fixture = TestBed.createComponent(JobsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
