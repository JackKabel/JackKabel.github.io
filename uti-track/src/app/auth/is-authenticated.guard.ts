import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    await authService.account.get();
    return true;
  } catch {
    return await router.navigate(['/auth', 'login']);
  }
};
