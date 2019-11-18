import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate{

  unprotectedRoutes = ["", "logIn", "signUp"];

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log("Activated Route Snapshot: " + route);
    // console.log("Router State Snapshot: " + state);

    if (!this.unprotectedRoutes.includes(state.url)) {  //Trying to access a protected page
        if (localStorage.length > 0) {
          return true;
        }
    }

    console.log("Route denied!");
    this.router.navigate(["/logIn"]);
    return false;
  }
}
