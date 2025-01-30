import {Component, OnInit} from '@angular/core';
import {NbMenuItem, NbSidebarService} from "@nebular/theme";
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {isHandset} from "./app.signals";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
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
              private router: Router,
              private breakpointObserver: BreakpointObserver) {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath'); // Clean up
      void this.router.navigate([redirectPath]); // Navigate to stored route
    }
  }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      isHandset.set(result.matches);
    });
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
