import {Component, Input} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: false
})
export class AuthComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  @Input()
  authType: 'login' | 'register' = 'login';

  constructor(private authService: AuthService) {}

  login(email: string, password: string) {
    void this.authService.login(email, password);
  }

  register(name: string, email: string, password: string) {
    void this.authService.register(name, email, password);
  }
}
