import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpPageComponent } from './sign-up-page.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_USER } from '../testResources';
import { of as observableOf, of } from 'rxjs';
import { MongodbService } from 'src/services/mongodb/mongodb.service';

describe('SignUpPageComponent', () => {
  let component: SignUpPageComponent;
  let fixture: ComponentFixture<SignUpPageComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["createUser"])
  mockMongodbService.createUser.and.returnValue(of(MOCK_USER));

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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.repeatedPassword).toEqual("");
    expect(component.emailExists).toEqual(false);
  });

  it('create user', () => {
    component.createUser();
    expect(component.mongodbService.createUser).toHaveBeenCalled();
  });
});
