import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogInPageComponent } from './log-in-page.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from '../commonDependencies';

describe('LogInPageComponent', () => {
  let component: LogInPageComponent;
  let fixture: ComponentFixture<LogInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
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
});
