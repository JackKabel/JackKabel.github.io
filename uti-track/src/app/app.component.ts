import {Component, OnInit} from '@angular/core';
import {account} from '../lib/appwrite';
import {ID} from 'appwrite';
import {NbMenuItem, NbSidebarService} from "@nebular/theme";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  loggedInUser: any = null;
  email: string = '';
  password: string = '';
  menuItems: NbMenuItem[] = [
    {
      title: 'Work calendar',
      icon: 'calendar-outline',
    },
  ];

  constructor(private sidebarService: NbSidebarService) {
  }

  _authRequested: { value: boolean, type?: 'login' | 'register' } = {value: false};

  get authRequested() {
    return this._authRequested;
  }

  set authRequested(request: { value: boolean, type?: 'login' | 'register' }) {
    this._authRequested = request;
  }

  async ngOnInit() {
    this.loggedInUser = await account.get();
  }

  async login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    this.loggedInUser = await account.get();
  }

  async register(email: string, password: string) {
    await account.create(ID.unique(), email, password);
    this.login(email, password);
  }

  async logout() {
    await account.deleteSession('current');
    this.loggedInUser = null;
  }

  toggleMenu() {
    this.sidebarService.toggle(true);
  }
}
