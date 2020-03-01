import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from 'src/app/testResources';
import { IUserModel } from '../../../../../mongodb-service/src/models/userModel';

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

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
