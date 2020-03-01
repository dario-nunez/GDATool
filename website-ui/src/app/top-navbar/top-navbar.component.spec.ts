import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavbarComponent } from './top-navbar.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from '../testResources';
import { IUserModel } from '../../../../mongodb-service/src/models/userModel';

const mockUser: IUserModel = {
  _id: "mock_id",
  name: "mock_name",
  email: "mock_mail",
  password: "mock_password"
}

const mockLocalStorage = {
  getItem: (key: string): string => {
    return JSON.stringify(mockUser);
  },
};

describe('TopNavbarComponent', () => {
  let component: TopNavbarComponent;
  let fixture: ComponentFixture<TopNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
    })
      .compileComponents();
  }));

  beforeEach(() => {
    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    fixture = TestBed.createComponent(TopNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
