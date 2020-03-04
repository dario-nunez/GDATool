import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusLineComponent } from './status-line.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_STATUS_LINE } from 'src/app/testResources';

describe('StatusLineComponent', () => {
  let component: StatusLineComponent;
  let fixture: ComponentFixture<StatusLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusLineComponent);
    component = fixture.componentInstance;    
    component.statusLine = MOCK_STATUS_LINE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit assigns correct label to status line', () => {
    component.statusLine.jobStatus = 1;
    component.statusLine.lineTriggerStatus = 1;
    component.ngOnInit();
    expect(component.badgeColour).toEqual("success")
    expect(component.badgeText).toEqual("Done")
  });
});
