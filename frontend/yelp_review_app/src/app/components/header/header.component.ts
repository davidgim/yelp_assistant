import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatToolbar } from '@angular/material/toolbar';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Router, RouterLink, NavigationEnd, Event as NavigationEvent} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavBarComponent, MatToolbar, SearchFormComponent, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isSearchPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => { 
      if (event instanceof NavigationEnd) {
        this.isSearchPage = event.urlAfterRedirects === '/';
      }
    })
  }
}
