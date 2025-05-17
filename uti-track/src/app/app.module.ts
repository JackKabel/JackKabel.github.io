import {AppComponent} from "./app.component";
import {NgModule, isDevMode} from "@angular/core";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {BrowserModule} from "@angular/platform-browser";
import {provideRouter, RouterModule, withComponentInputBinding} from "@angular/router";
import {routes} from "./app.routes";
import {
  NbAlertModule,
  NbBadgeModule,
  NbButtonGroupModule,
  NbButtonModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbProgressBarModule,
  NbSidebarModule,
  NbThemeModule,
  NbUserModule
} from "@nebular/theme";
import {FormsModule} from "@angular/forms";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {AuthComponent} from './auth/auth/auth.component';
import {HomeComponent} from './home/home.component';
import {CalendarComponent} from './calendar/calendar/calendar.component';
import { Calendar2Component } from './calendar-2/calendar-2.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    CalendarComponent,
    Calendar2Component,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NbThemeModule.forRoot({name: 'dark'}),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    FormsModule,
    NbLayoutModule,
    NbInputModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NbMenuModule,
    NbProgressBarModule,
    NbAlertModule,
    NbUserModule,
    NbButtonGroupModule,
    NbBadgeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withComponentInputBinding())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
