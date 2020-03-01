import { TestBed } from '@angular/core/testing';

import { MongodbService } from './mongodb.service';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from 'src/app/testResources';

describe('MongodbService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: COMMON_DECLARATIONS,
    imports: COMMON_IMPORTS,
    providers: [
      MongodbService
    ]
  }));

  it('should be created', () => {
    const service: MongodbService = TestBed.get(MongodbService);
    expect(service).toBeTruthy();
  });
});
