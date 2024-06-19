import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { faUser, faPowerOff, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    FontAwesomeModule,
    AsyncPipe,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdown,
    NgbCollapse,
    NgIf,
    RouterLink,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isCollapsed = true;
  faUser = faUser;
  faPowerOff = faPowerOff;
  faHouse = faHouse;
  faRightFromBracket = faRightFromBracket;

  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  loginWithRedirect() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } })
  }
}
