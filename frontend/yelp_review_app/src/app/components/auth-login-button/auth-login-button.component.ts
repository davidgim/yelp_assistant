import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-login-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './auth-login-button.component.html',
  styleUrl: './auth-login-button.component.css'
})
export class AuthLoginButtonComponent implements OnInit {
  isAuthenticated = false;
  user: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.isAuthenticated$.subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );

    this.auth.user$.subscribe(
      user => this.user = user
    );
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
  }
}
