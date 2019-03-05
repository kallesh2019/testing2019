import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
    
   constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (sessionStorage.currentUser == "true") {
            // logged in so return true
            return true;
        } else {
          this.router.navigate(['/login'], {
                queryParams: {
                  return: state.url
                }
              });
          return false;            
        }

  }
}
