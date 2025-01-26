import {Routes} from '@angular/router';
import {AuthComponent} from "./auth/auth/auth.component";
import {HomeComponent} from "./home/home.component";
import {CalendarComponent} from "./calendar/calendar/calendar.component";


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: []
  },
  {
    path: 'auth/:authType',
    component: AuthComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent
  }
];
