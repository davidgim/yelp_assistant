import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { filter, forkJoin } from 'rxjs';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { MatToolbar } from '@angular/material/toolbar';
import { ApiService } from '../../api.service';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from '../../search.service';

interface Business {
  business_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatToolbar,
    MatIconModule,
    SearchResultsComponent],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent implements OnInit {
  state = '';
  city = '';
  category = '';
  businessName = '';
  states: string[] = [];
  cities: string[] = [];
  categories: string[] = [];
  businesses: { business_id: string, name: string, address: string, city: string, state: string }[]= [];
  filteredStates = this.states;
  filteredCities = this.cities;
  filteredCategories = this.categories;
  filteredBusinesses = this.businesses;
  showResults: boolean = false;

  private locationsDict: { [key: string]: string[] } = {};
  constructor(private apiService: ApiService, private searchService: SearchService) { }

  ngOnInit() {
    // Load categories and all locations in parallel
    forkJoin({
      categories: this.apiService.getCategories(),
      locations: this.apiService.getAllLocationsNoPagination() // Get all locations without pagination
    }).subscribe({
      next: (results) => {
        // Process categories
        this.categories = results.categories;
        this.filteredCategories = this.categories;
        
        // Process locations for both states and city lookup
        this.locationsDict = results.locations.locations.reduce((acc, { state, city }) => {
          if (!acc[state]) acc[state] = [];
          if (!acc[state].includes(city)) { // Avoid duplicate cities
            acc[state].push(city);
          }
          return acc;
        }, {} as { [key: string]: string[] });
        
        // Sort cities within each state alphabetically
        Object.keys(this.locationsDict).forEach(state => {
          this.locationsDict[state].sort();
        });
        
        // Extract states from the locations dictionary
        this.states = Object.keys(this.locationsDict).sort();
        this.filteredStates = this.states;
        console.log('States loaded:', this.states.length);
      },
      error: (error) => console.error('Error fetching data:', error)
    });
  }

  handleSearch() {
    this.apiService.searchBusinesses(this.state, this.city, this.category, this.businessName).subscribe({
      next: (data: Business[]) => {
        this.filteredBusinesses = data;
        this.showResults = true;
        this.searchService.updateSearchResults(this.filteredBusinesses);
      },
      error: (error) => console.error('Error fetching search results:', error)
    });
  }

  filterStates() {
    if (this.showResults) {
      this.showResults = false;
    }
    const filterValue = this.state.toLowerCase();
    this.filteredStates = this.states.filter(option => option.toLowerCase().includes(filterValue));
    if (this.state) {
      this.onStateSelected()
    } else {
      this.filteredCities = [];
      this.filteredBusinesses = [];
    }

  }

  onStateSelected() {
    if (this.showResults) {
      this.showResults = false;
    }
    this.cities = this.locationsDict[this.state] || [];
    const currentCityValid = this.cities.includes(this.city);
    this.filteredCities = this.cities;
    if (!currentCityValid) {
      this.city = '';
    }
    this.filteredBusinesses = [];
  }

  filterCities() {
    if (this.showResults) {
      this.showResults = false;
    }
    const filterValue = this.city.toLowerCase();
    this.filteredCities = this.cities.filter(option => option.toLowerCase().includes(filterValue));
    if (this.city) {
      const states = Object.keys(this.locationsDict).filter(state => this.locationsDict[state].includes(this.city));
      const currentStateValid = this.states.includes(this.state);
      if (!currentStateValid) {
        this.state = '';
      }
      this.filteredBusinesses = [];
    } else {
      this.filteredStates = this.states;
      this.filteredBusinesses = [];
    }
  }

  filterCategories() {
    if (this.showResults) {
      this.showResults = false;
    }
    const filterValue = this.category.toLowerCase();
    this.filteredCategories = this.categories.filter(option => option.toLowerCase().includes(filterValue));
    this.onCategorySelected();
  }

  onCategorySelected() {
    if (this.category) {
      this.filterBusinesses();
    }
  }

  filterBusinesses() {
    this.apiService.searchBusinesses(this.state, this.city, this.category, '').subscribe({
      next: (data: Business[]) => {
        this.businesses = data;
        this.filteredBusinesses = data;
      },
      error: (error) => console.error('Error fetching businesses:', error)
    });
  }

  filterBusinessNames() {
    if (this.showResults) {
      this.showResults = false;
    }
    const filterValue = this.businessName.toLowerCase();
    this.filteredBusinesses = this.businesses.filter(business => business.name.toLowerCase().includes(filterValue))
  }
}


