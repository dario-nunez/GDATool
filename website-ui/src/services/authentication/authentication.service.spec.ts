import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { COMMON_IMPORTS, COMMON_DECLARATIONS } from 'src/app/commonDependencies';

describe('AuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: COMMON_DECLARATIONS,
    imports: COMMON_IMPORTS,
    providers: [
      AuthenticationService
    ]
  }));

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });
});
