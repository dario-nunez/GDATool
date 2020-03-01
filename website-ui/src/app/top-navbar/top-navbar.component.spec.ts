import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavbarComponent } from './top-navbar.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_USER } from '../testResources';

const mockLocalStorage = {
  getItem: (key: string): string => {
    return JSON.stringify(MOCK_USER);
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
