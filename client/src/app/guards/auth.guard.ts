import { Injectable }       from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService }      from '../services/auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  get role(): string {
    return this.authService.user.role
  }

  canActivateAuth(router, state) {
    const roles = router.data["roles"] as Array<string>;
    if(this.authService.loggedIn() && this.authService.isBlocked() && roles.indexOf(this.role) != -1) {
      return true;
    } else {
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (!this.authService.user && this.authService.loggedIn()) {
    return this.authService.getProfile().map((data): boolean => {
        this.authService.user = (<any>data).user;
        return this.canActivateAuth(router, state)
      })
    } else {
      return this.canActivateAuth(router, state)
    }
  }
}
