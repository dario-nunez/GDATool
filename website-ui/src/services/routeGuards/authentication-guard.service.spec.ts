import { TestBed } from '@angular/core/testing';

import { AuthenticationGuardService } from './authentication-guard.service';
import { COMMON_DECLARATIONS, COMMON_IMPORTS } from 'src/app/testResources';

describe('AuthenticationGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: COMMON_DECLARATIONS,
    imports: COMMON_IMPORTS,
    providers: [
      AuthenticationGuardService
    ]
  }));

  it('should be created', () => {
    const service: AuthenticationGuardService = TestBed.get(AuthenticationGuardService);
    expect(service).toBeTruthy();
  });
});
