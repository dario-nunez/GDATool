import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from 'src/app/commonDependencies';
import { IUserModel } from '../../../../../mongodb-service/src/models/userModel';

const mockUser: IUserModel = {
  _id: "mock_id",
  name: "mock_name",
  email: "emock_mail",
  password: "mock_password"
}

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
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    localStorage.setItem("user", JSON.stringify(mockUser))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
