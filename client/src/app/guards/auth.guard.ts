import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  get role(): string {
    return this.authService.user.role
  }

  canActivateAuth(route, state) {
    const roles = route.data["roles"] as Array<string>;
    if(this.authService.loggedIn() && this.authService.isBlocked() && roles.indexOf(this.role) != -1) {
      return true;
    } else {
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }

  reloadUserAuth(route, state) {
    return this.authService.getProfile().map((data): boolean => {
      this.authService.user = (<any>data).user;
      return this.canActivateAuth(route, state)
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if(this.authService.admin) {
      this.authService.AdminSerfEnd()
    }
    if (!this.authService.user && this.authService.loggedIn()) {
        return this.reloadUserAuth(route, state)
    } else {
      return this.canActivateAuth(route, state)
    }
  }
}
