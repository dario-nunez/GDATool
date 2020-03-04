import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { UserPageComponent } from './user-page.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_USER } from '../testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';

const mockLocalStorage = {
  getItem: (key: string): string => {
    return JSON.stringify(MOCK_USER);
  },
};

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["updateUser", "getUserByEmail", "deleteUserRecursive"]);
  mockMongodbService.getUserByEmail.and.returnValue(of(MOCK_USER));
  mockMongodbService.deleteUserRecursive.and.returnValue(of(MOCK_USER));
  mockMongodbService.updateUser.and.returnValue(of(MOCK_USER));

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
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.mongodbService.getUserByEmail).toHaveBeenCalled();
  });

  it('updateAccount button registers mongodb service call', () => {
    component.updateAccount();
    expect(component.mongodbService.updateUser).toHaveBeenCalled();
  });

  it('deleteAccount button registers mongodb service call', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteAccount();
    expect(component.mongodbService.deleteUserRecursive).toHaveBeenCalled();
  });
});
