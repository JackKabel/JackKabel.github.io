import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {BrowserModule} from "@angular/platform-browser";
import {provideRouter, RouterModule, withComponentInputBinding} from "@angular/router";
import {routes} from "./app.routes";
import {
  NbAlertModule,
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

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    CalendarComponent,
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
