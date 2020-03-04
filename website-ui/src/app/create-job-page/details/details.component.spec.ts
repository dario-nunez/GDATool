import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_USER, MOCK_JOB } from 'src/app/testResources';
import { of as observableOf, of } from 'rxjs';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { RouterTestingModule } from '@angular/router/testing';

const MOCK_LOCAL_STORAGE = {
  getItem: (key: string): string => {
    return JSON.stringify(MOCK_USER);
  },
};

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["createJob"]);
  mockMongodbService.createJob.and.returnValue(of(MOCK_JOB));
  const mockRouter = jasmine.createSpyObj("RouterTestingModule", ["navigate"]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: RouterTestingModule,
          useValue: mockRouter
        },
        {
          provide: MongodbService,
          useValue: mockMongodbService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(localStorage, "getItem").and.callFake(MOCK_LOCAL_STORAGE.getItem);
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createJob button registers mongodb service call', () => {
    component.createJob();
    expect(component.mongodbService.createJob).toHaveBeenCalled();
  });
});
