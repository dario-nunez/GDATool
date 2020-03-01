import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_USER } from 'src/app/testResources';

const mockLocalStorage = {
  getItem: (key: string): string => {
    return JSON.stringify(MOCK_USER);
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
