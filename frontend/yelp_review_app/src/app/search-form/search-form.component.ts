import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import axios from 'axios';
import { filter } from 'rxjs';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [],
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
  businesses: { business_id: string, name: string }[]= [];
  filteredStates = this.states;
  filteredCities = this.cities;
  filteredCategories = this.categories;
  filteredBusinesses = this.businesses;

  async ngOnInit() {
      await this.fetchStates();
      await this.fetchCategories();
  }

  async fetchStates() {
    try {
      const response = await axios.get('/api/states');
      this.states = response.data;
      this.filteredStates = this.states;
    } catch (error) {
      console.error('Error fetching states: ', error)
    }
  }

  async fetchCategories() {
    try {
      const response = await axios.get('/api/categories');
      this.categories = response.data;
      this.filteredCategories = this.categories;
    } catch (error) {
      console.error('Error fetching states: ', error);
    }
  }

  async handleSearch() {
    try {
      const response = await axios.post('/api/search', {
        city: this.city,
        state: this.state,
        category: this.category,
        businessName: this.businessName
      });
    } catch (error) {
      console.error('Error fetching search results: ', error);
    }
  }

  async filterStates() {
    const filterValue = this.state.toLowerCase();
    this.filteredStates = this.states.filter(option => option.toLowerCase().includes(filterValue));
    if (this.state) {
      try {
        const response = await axios.get('/api/cities', { params: { state: this.state } });
        const cities = response.data;
        const currentCityValid = cities.includes(this.city);

        this.cities = cities;
        this.filteredCities = this.cities;
        if (!currentCityValid) {
          this.city = '';
        }
        this.filteredBusinesses = [];
      } catch (error) {
        console.error('Error fetching cities: ', error)
      }
      await this.filterBusinesses();
    } else {
      this.filteredCities = [];
      this.filteredBusinesses = [];
    }
  }

  async filterCities() {
    const filterValue = this.city.toLowerCase();
    this.filteredCities = this.cities.filter(option => option.toLowerCase().includes(filterValue));
    if (this.city) {
      try {
        const response = await axios.get('/api/cities', { params: { state: this.state } });
        const states = response.data;
        const currentStateValid = states.includes(this.state);

        this.filteredStates = this.states;

        if (!currentStateValid) {
          this.state = '';
        }
        this.filteredBusinesses = [];
      } catch (error) {
        console.error('Error fetching states: ', error)
      }
      await this.filterBusinesses();
    } else {
      this.filteredStates = this.states;
      this.filteredBusinesses = [];
    }
  }

  filterCategories() {
    const filterValue = this.category.toLowerCase();
    this.filteredCategories = this.categories.filter(option => option.toLowerCase().includes(filterValue));
    if (this.category) {
      this.filterBusinesses();
    }
  }

  async filterBusinesses() {
    try {
      const response = await axios.get('/api/businesses', { params: { state: this.state, city: this.city, categories: this.categories } });
      this.businesses = response.data;
      this.filteredBusinesses = this.businesses;
    } catch (error) {
      console.error('Error fetching businesses: ', error)
    }
  }

  filterBusinessNames() {
    const filterValue = this.businessName.toLowerCase();
    this.filteredBusinesses = this.businesses.filter(business => business.name.toLowerCase().includes(filterValue))
  }
}


