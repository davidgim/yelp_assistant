import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BusinessSummaryDialogComponent } from '../business-summary-dialog/business-summary-dialog.component';
import { ApiService } from '../../api.service';
import { AuthService } from '@auth0/auth0-angular';
import { SearchService } from '../../search.service';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Business {
  business_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating?: number;
  distance?: number;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit {
  businesses: Business[] = [];
  selectedBusiness: Business | null = null;
  summary = '';
  loading = false;
  faLocationDot = faLocationDot;
  currentSort: 'rating' | 'distance' = 'rating';
  
  constructor(
    public auth: AuthService, 
    private dialog: MatDialog, 
    private apiService: ApiService, 
    private searchService: SearchService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.filteredBusinesses$.subscribe(businesses => {
      this.businesses = businesses;
    });
  }

  sortByRating() {
    this.currentSort = 'rating';
    this.businesses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  sortByDistance() {
    this.currentSort = 'distance';
    this.businesses.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  selectBusiness(business: Business) {
    this.loading = true;
    this.selectedBusiness = business;
    this.auth.user$.subscribe((user) => {
      const userId = user ? user.sub : undefined;
      this.apiService.summarizeBusiness(business.business_id, userId).subscribe({
        next: (data: any) => {
          this.summary = data.summary;
          this.loading = false;
          this.openDialog(business.name, business.business_id, this.summary);
        },
        error: (error) => {
          console.error('Error fetching summary:', error);
          this.loading = false;
        }
      });
    });
  }
    
  openDialog(name: string, businessId: string, summary: string): void {
    const dialogRef = this.dialog.open(BusinessSummaryDialogComponent, {
      data: { name, businessId, summary },
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'business-summary-dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.resetState();
    });
  }

  private resetState() {
    this.summary = '';
    this.selectedBusiness = null;
  }
}

