import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AggregationFilteringComponent } from './aggregation-filtering.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_QUERY_SERVICE, MOCK_SCHEMA_SERVICE } from 'src/app/testResources';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';

describe('AggregationFilteringComponent', () => {
  let component: AggregationFilteringComponent;
  let fixture: ComponentFixture<AggregationFilteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: QueryService,
          useValue: MOCK_QUERY_SERVICE
        },
        {
          provide: SchemaService,
          useValue: MOCK_SCHEMA_SERVICE
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
