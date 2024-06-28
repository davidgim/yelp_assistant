import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private filteredBusinessesSource = new BehaviorSubject<any[]>([]);
  filteredBusinesses$ = this.filteredBusinessesSource.asObservable();

  private showResultsSource = new BehaviorSubject<boolean>(false);
  showResults$ = this.showResultsSource.asObservable();

  updateSearchResults(businesses: any[]): void {
    this.filteredBusinessesSource.next(businesses);
    this.setShowResults(businesses.length > 0);
  }

  setShowResults(show: boolean): void {
    this.showResultsSource.next(show);
  }
  constructor() { }
}
