import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {account, databases} from '../lib/appwrite';
import {ID} from 'appwrite';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'CrowClient';
  loggedInUser: any = null;
  email: string = '';
  password: string = '';
  name: string = '';

  async login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    this.loggedInUser = await account.get();
  }

  async register(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name);
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
