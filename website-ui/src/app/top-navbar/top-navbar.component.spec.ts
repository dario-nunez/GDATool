import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from '../commonDependencies';

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
    localStorage.setItem("user", JSON.stringify("user"));
    fixture = TestBed.createComponent(TopNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
