import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { UserPageComponent } from './user-page.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS } from '../commonDependencies';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { IUserModel } from '../../../../mongodb-service/src/models/userModel';

const mockUser: IUserModel = {
  _id: "mock_id",
  name: "mock_name",
  email: "emock_mail",
  password: "mock_password"
}

const mockLocalStorage = {
  getItem: (key: string): string => {
    return JSON.stringify(mockUser);
  },
};

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getUserByEmail"])
  mockMongodbService.getUserByEmail.and.returnValue(of(mockUser));

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
    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
