import { TestBed } from '@angular/core/testing';

import { QueryService } from './query.service';
import { COMMON_IMPORTS, COMMON_DECLARATIONS } from 'src/app/commonDependencies';

describe('QueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: COMMON_DECLARATIONS,
    imports: COMMON_IMPORTS,
    providers: [
      QueryService
    ]
  }));

  it('should be created', () => {
    const service: QueryService = TestBed.get(QueryService);
    expect(service).toBeTruthy();
  });
});
