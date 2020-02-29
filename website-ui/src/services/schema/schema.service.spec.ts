import { TestBed } from '@angular/core/testing';

import { SchemaService } from './schema.service';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from 'src/app/commonDependencies';

describe('SchemaService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: COMMON_DECLARATIONS,
    imports: COMMON_IMPORTS,
    providers: [
      SchemaService
    ]
  }));

  it('should be created', () => {
    const service: SchemaService = TestBed.get(SchemaService);
    expect(service).toBeTruthy();
  });
});
