import { Component } from '@angular/core';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchResultsComponent } from '../../components/search-results/search-results.component';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchFormComponent, SearchResultsComponent, AsyncPipe, NgIf],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  constructor(public auth: AuthService) {}
}
