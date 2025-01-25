import {Routes} from '@angular/router';
import {AuthComponent} from "./auth/auth/auth.component";
import {HomeComponent} from "./home/home.component";
import {isAuthenticatedGuard} from "./auth/is-authenticated.guard";


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'auth/:authType',
    component: AuthComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [isAuthenticatedGuard]
  }
];
