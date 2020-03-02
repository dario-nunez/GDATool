import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, of } from 'rxjs';
import { SchemaComponent } from './schema.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_JOB } from 'src/app/testResources';
import { MongodbService } from 'src/services/mongodb/mongodb.service';
import { ActivatedRoute } from '@angular/router';

describe('SchemaComponent', () => {
  let component: SchemaComponent;
  let fixture: ComponentFixture<SchemaComponent>;

  const mockMongodbService = jasmine.createSpyObj("MongodbService", ["getJobById", "readFile", "deleteJobRecusrive", "updateJob"])
  mockMongodbService.getJobById.and.returnValue(of(MOCK_JOB));
  mockMongodbService.deleteJobRecusrive.and.returnValue(of(MOCK_JOB));
  mockMongodbService.updateJob.and.returnValue(of(MOCK_JOB));
  mockMongodbService.readFile.and.returnValue(of(""));

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
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('move column from COLUMNS to FEATURES (double)', () => {
    component.COLUMNS = [["a", "double"], ["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [];
    component.SELECTED_METRICS = [];

    component.moveColumn(event, ["a", "double"], component.COLUMNS, component.SELECTED_FEATURES);

    expect(component.COLUMNS).toEqual([["a", "double"], ["b", "double"], ["c", "double"]])
    expect(component.SELECTED_FEATURES).toEqual([["a", "double"]])
    expect(component.SELECTED_METRICS).toEqual([])
  });

  it('move column from COLUMNS to FEATURES (string)', () => {
    component.COLUMNS = [["a", "string"], ["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [];
    component.SELECTED_METRICS = [];

    component.moveColumn(event, ["a", "string"], component.COLUMNS, component.SELECTED_FEATURES);

    expect(component.COLUMNS).toEqual([["b", "double"], ["c", "double"]])
    expect(component.SELECTED_FEATURES).toEqual([["a", "string"]])
    expect(component.SELECTED_METRICS).toEqual([])
  });

  it('move column from COLUMNS to METRICS (double)', () => {
    component.COLUMNS = [["a", "double"], ["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [];
    component.SELECTED_METRICS = [];

    component.moveColumn(event, ["a", "double"], component.COLUMNS, component.SELECTED_METRICS);

    expect(component.COLUMNS).toEqual([["a", "double"], ["b", "double"], ["c", "double"]])
    expect(component.SELECTED_METRICS).toEqual([["a", "double"]])
    expect(component.SELECTED_FEATURES).toEqual([])
  });

  it('move column from COLUMNS to METRICS (string)', () => {
    component.COLUMNS = [["a", "string"], ["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [];
    component.SELECTED_METRICS = [];

    component.moveColumn(event, ["a", "string"], component.COLUMNS, component.SELECTED_METRICS);

    expect(component.COLUMNS).toEqual([["b", "double"], ["c", "double"]])
    expect(component.SELECTED_METRICS).toEqual([["a", "string"]])
    expect(component.SELECTED_FEATURES).toEqual([])
  });

  it('move column from FEATURES to COLUMNS (double)', () => {
    component.COLUMNS = [["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [["a", "double"]];
    component.SELECTED_METRICS = [];

    component.moveColumn(event, ["a", "double"], component.SELECTED_FEATURES, component.COLUMNS);

    expect(component.COLUMNS).toEqual([["b", "double"], ["c", "double"], ["a", "double"]])
    expect(component.SELECTED_FEATURES).toEqual([])
    expect(component.SELECTED_METRICS).toEqual([])
  });

  it('move column from FEATURES to COLUMNS (string)', () => {
    component.COLUMNS = [["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [["a", "string"]];
    component.SELECTED_METRICS = [];

    component.moveColumn(event, ["a", "string"], component.SELECTED_FEATURES, component.COLUMNS);

    expect(component.COLUMNS).toEqual([["b", "double"], ["c", "double"], ["a", "string"]])
    expect(component.SELECTED_FEATURES).toEqual([])
    expect(component.SELECTED_METRICS).toEqual([])
  });

  it('move column from METRICS to COLUMNS (double)', () => {
    component.COLUMNS = [["b", "double"], ["c", "double"]];
    component.SELECTED_METRICS = [["a", "double"]];
    component.SELECTED_FEATURES = [];

    component.moveColumn(event, ["a", "double"], component.SELECTED_METRICS, component.COLUMNS);

    expect(component.COLUMNS).toEqual([["b", "double"], ["c", "double"], ["a", "double"]])
    expect(component.SELECTED_FEATURES).toEqual([])
    expect(component.SELECTED_METRICS).toEqual([])
  });

  it('move column from METRICS to COLUMNS (string)', () => {
    component.COLUMNS = [["b", "double"], ["c", "double"]];
    component.SELECTED_METRICS = [["a", "string"]];
    component.SELECTED_FEATURES = [];

    component.moveColumn(event, ["a", "string"], component.SELECTED_METRICS, component.COLUMNS);

    expect(component.COLUMNS).toEqual([["b", "double"], ["c", "double"], ["a", "string"]])
    expect(component.SELECTED_FEATURES).toEqual([])
    expect(component.SELECTED_METRICS).toEqual([])
  });

  it('move column from COLUMNS to FEATURES (double) already exists', () => {
    component.COLUMNS = [["a", "double"], ["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [["a", "double"]];
    component.SELECTED_METRICS = [];

    component.moveColumn(event, ["a", "double"], component.COLUMNS, component.SELECTED_FEATURES);

    expect(component.COLUMNS).toEqual([['a', 'double'], ['b', 'double'], ['c', 'double']])
    expect(component.SELECTED_FEATURES).toEqual([['a', 'double'], ['a', 'double']])
    expect(component.SELECTED_METRICS).toEqual([])
  });

  it('move column from COLUMNS to METRICS (double) already exists', () => {
    component.COLUMNS = [["a", "double"], ["b", "double"], ["c", "double"]];
    component.SELECTED_FEATURES = [];
    component.SELECTED_METRICS = [["a", "double"]];

    component.moveColumn(event, ["a", "double"], component.COLUMNS, component.SELECTED_METRICS);

    expect(component.COLUMNS).toEqual([['a', 'double'], ['b', 'double'], ['c', 'double']])
    expect(component.SELECTED_METRICS).toEqual([['a', 'double'], ['a', 'double']])
    expect(component.SELECTED_FEATURES).toEqual([])
  });

  it('next', () => {
    component.next();
    expect(component.mongodbService.updateJob).toHaveBeenCalled();
  });

  it('delete job', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteJob();
    expect(component.mongodbService.deleteJobRecusrive).toHaveBeenCalled();
  });
});
