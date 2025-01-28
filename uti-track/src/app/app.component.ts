import {Component} from '@angular/core';
import {NbMenuItem, NbSidebarService} from "@nebular/theme";
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  menuItems: NbMenuItem[] = [
    {
      title: 'Work calendar',
      icon: 'calendar-outline',
      link: '/calendar',
    },
  ];

  constructor(private sidebarService: NbSidebarService,
              protected authService: AuthService,
              private router: Router) {
  }

  login() {
    void this.router.navigate(['/auth', 'login'])
  }

  logout() {
    void this.authService.logout();
  }

  toggleMenu() {
    this.sidebarService.toggle(false);
  }
}
