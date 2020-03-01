import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusLineComponent } from './status-line.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS } from 'src/app/testResources';
import { By } from '@angular/platform-browser';
import { IStatusLine } from 'src/models/statusLine.model';

describe('StatusLineComponent', () => {
  let component: StatusLineComponent;
  let fixture: ComponentFixture<StatusLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusLineComponent);
    component = fixture.componentInstance;
    const inputStatusLine = fixture.debugElement.query(By.css('.statusLine'));
    let mockStatusLine:IStatusLine = {
      jobStatus: 0,
      lineText: "lineTest",
      lineTriggerStatus: 1
    }
    component.statusLine = mockStatusLine;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
