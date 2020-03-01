import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingPageComponent } from './marketing-page.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from '../testResources';

describe('MarketingPageComponent', () => {
  let component: MarketingPageComponent;
  let fixture: ComponentFixture<MarketingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
