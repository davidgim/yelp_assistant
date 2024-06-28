import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { filter } from 'rxjs';
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
    this.apiService.getAllLocations().subscribe({
      next: (data: { state: string, city: string}[]) => {
        this.locationsDict = data.reduce((acc, { state, city }) => {
          if (!acc[state]) acc[state] = [];
          acc[state].push(city);
          return acc;
        }, {} as { [key: string]: string[] });
        this.states = Object.keys(this.locationsDict);
        this.filteredStates = this.states;
      },
      error: (error) => console.error('Error fetching locations ', error)
    });
    this.apiService.getStates().subscribe({
      next: (data: string[]) => {
         this.states = data;
        this.filteredStates = data;
      },
       error: (error) => console.error('Error fetching states:', error)
    });

    this.apiService.getCategories().subscribe({
      next: (data: string[]) => {
         this.categories = data;
         this.filteredCategories = data;
       },
       error: (error) => console.error('Error fetching states:', error)
    })
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


