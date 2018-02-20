import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminSerfGuard implements CanActivate {
  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  get role(): string {
    return this.authService.user.role
  }

  canActivateAuth(route, state, admin, user) {
    const roles = route.data["roles"] as Array<string>;
    if(this.authService.loggedIn() && this.authService.isBlocked() && roles.indexOf(this.role) != -1) {
      this.authService.user = user;
      this.authService.admin = admin;
      return true;
    } else {
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
      return this.authService.getSerfProfile(route.params['_id']).map((data): boolean => {
        this.authService.user = (<any>data).admin;
        return this.canActivateAuth(route, state, (<any>data).admin, (<any>data).user)
      })
  }
}
