import {CanActivateFn, Router} from '@angular/router';
import {tap} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn$.pipe(
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        void router.navigateByUrl('/auth');
      }
    })
  );
};
