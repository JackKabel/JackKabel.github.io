import {Routes} from '@angular/router';
import {AuthComponent} from "./auth/auth/auth.component";
import {HomeComponent} from "./home/home.component";
import {CalendarComponent} from "./calendar/calendar/calendar.component";
import {isAuthenticatedGuard} from "./auth/is-authenticated.guard";
import {Calendar2Component} from "./calendar-2/calendar-2.component";


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: []
  },
  {
    path: 'auth/:authType',
    component: AuthComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'calendar-2',
    component: Calendar2Component,
    canActivate: [isAuthenticatedGuard]
  }
];
