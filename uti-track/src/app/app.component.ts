import {Component, OnInit} from '@angular/core';
import {account, databases} from '../lib/appwrite';
import {ID} from 'appwrite';
import {NbCalendarRange, NbDateService} from "@nebular/theme";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  loggedInUser: any = null;
  email: string = '';
  password: string = '';
  range: NbCalendarRange<Date>;

  constructor(protected dateService: NbDateService<Date>) {
    this.range = {
      start: this.dateService.addDay(this.monthStart, 3),
      end: this.dateService.addDay(this.monthEnd, -3),
    };
  }

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date());
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

  listNames() {
    databases.listDocuments(
      '67935fe8002425d5d665',
      '67935ff4001dc8b5add1',
      []
    );
  }
}
