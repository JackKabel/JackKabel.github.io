import {Component, Input} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  @Input()
  authType: 'login' | 'register' = 'login';

  constructor(private authService: AuthService) {}

  login(email: string, password: string) {
    void this.authService.login(email, password);
  }

  register(email: string, password: string) {
    void this.authService.register(email, password);
  }
}
