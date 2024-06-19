import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-login-button',
  standalone: true,
  imports: [],
  templateUrl: './auth-login-button.component.html',
  styleUrl: './auth-login-button.component.css'
})
export class AuthLoginButtonComponent {
  constructor(public auth: AuthService) {}
}
