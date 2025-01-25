import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {BrowserModule} from "@angular/platform-browser";
import {provideRouter, RouterModule, withComponentInputBinding} from "@angular/router";
import {routes} from "./app.routes";
import {
  NbButtonModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule
} from "@nebular/theme";
import {FormsModule} from "@angular/forms";
import {NbEvaIconsModule} from "@nebular/eva-icons";

@NgModule({
  declarations: [
    AppComponent
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
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withComponentInputBinding())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
