import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of, Observable } from 'rxjs';
import { GeneralPlotsComponent } from './general-plots.component';
import { COMMON_DECLARATIONS, COMMON_IMPORTS, MOCK_SCHEMA_SERVICE, MOCK_QUERY_SERVICE, MOCK_JOB, MOCK_JOBS, MOCK_PLOT } from 'src/app/testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';
import { QueryService } from 'src/services/query/query.service';
import { SchemaService } from 'src/services/schema/schema.service';
import { IPlotModel } from '../../../../../../mongodb-service/src/models/plotModel';

describe('GeneralPlotsComponent', () => {
  let component: GeneralPlotsComponent;
  let fixture: ComponentFixture<GeneralPlotsComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById"])
  mockMongodbService.getJobById.and.returnValue(of(MOCK_JOB));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS,
      providers: [
        {
          provide: MongodbService,
          useValue: mockMongodbService
        },
        {
          provide: QueryService,
          useValue: MOCK_QUERY_SERVICE
        },
        {
          provide: SchemaService,
          useValue: MOCK_SCHEMA_SERVICE
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: 'url', params: {}, queryParams: {}, data: {}, paramMap: {
                get: () => "string"
              }
            },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.queryService.generalPlots.length).toEqual(0);
    expect(component.chosenXColumn).toEqual("");
    expect(component.chosenYColumn).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");
    expect(component.xAvailableColumns).toEqual([]);
    expect(component.yAvailableColumns).toEqual([]);
  });

  it('selectXColumn selects the given element', () => {
    component.COLUMNS = ["a", "b", "c"]
    component.selectXColumn(event, "a");
    expect(component.yAvailableColumns).toEqual(["b", "c"]);
  });

  it('selectYColumn selects the given element', () => {
    component.COLUMNS = ["a", "b", "c"]
    component.selectYColumn(event, "a");
    expect(component.xAvailableColumns).toEqual(["b", "c"]);
  });

  it('createPlot creates the expected Plot object', () => {
    component.COLUMNS = ["a", "b", "c"]
    component.chosenIdentifierColumn = "a"
    component.typeList = [["a", "double"], ["b", "double"], ["c", "string"]]
    component.chosenXColumn = "b"
    component.chosenYColumn = "c"

    const expectedPlot: IPlotModel = {
      jobId: MOCK_JOB._id,
      identifier: "a",
      identifierType: "quantitative",
      xAxis: "b",
      xType: "quantitative",
      yAxis: "c",
      yType: "nominal"
    }

    component.createPlot();

    expect(component.queryService.generalPlots[0]).toEqual(expectedPlot);
    expect(component.yAvailableColumns).toEqual(["a", "b", "c"]);
    expect(component.xAvailableColumns).toEqual(["a", "b", "c"]);
    expect(component.chosenXColumn).toEqual("");
    expect(component.chosenYColumn).toEqual("");
    expect(component.chosenIdentifierColumn).toEqual("");
  });

  it('deletePlot button registers mongodb service call', () => {
    component.queryService.generalPlots = [MOCK_PLOT];
    component.deletePlot(event, MOCK_PLOT);
    expect(component.queryService.generalPlots.length).toEqual(0);
  });
});
