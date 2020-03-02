import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogInPageComponent } from './log-in-page.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_USER } from '../testResources';
import { AuthenticationService } from 'src/services/authentication/authentication.service';
import { of as observableOf, of } from 'rxjs';

describe('LogInPageComponent', () => {
  let component: LogInPageComponent;
  let fixture: ComponentFixture<LogInPageComponent>;

  const mockAuthenticationService = jasmine.createSpyObj("AuthenticationService", ["authenticate"])
  mockAuthenticationService.authenticate.and.returnValue(of(MOCK_USER));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login', () => {
    component.login();
    expect(component.authenticationService.authenticate).toHaveBeenCalled()
  });
});
