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
      title: 'Home',
      home: true,
      icon: 'home-outline',
      link: '/home'
    },
    {
      title: 'My Projects',
      icon: 'cube-outline',
      badge: {
        text: '1',
        status: 'warning'
      },
      children: [
        {
          title: 'Work calendar',
          icon: 'calendar-outline',
          link: '/calendar',
          badge: {
            dotMode: true,
            status: 'warning',
          },
        },
      ]
    },
  ];
  compactMode: 'mobile' | 'tablet' | 'pc' = 'pc';

  constructor(private sidebarService: NbSidebarService,
              protected authService: AuthService,
              private router: Router) {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath'); // Clean up
      void this.router.navigate([redirectPath]); // Navigate to stored route
    }
  }

  login() {
    void this.router.navigate(['/auth', 'login'])
  }

  logout() {
    void this.authService.logout();
  }

  toggleMenu() {
    switch (this.compactMode) {
      case 'pc':
        this.sidebarService.toggle(true);
        break;
      case 'mobile':
        this.sidebarService.toggle(false);
        break;
      case 'tablet':
        this.sidebarService.toggle(true);
        break;
    }
  }
}
