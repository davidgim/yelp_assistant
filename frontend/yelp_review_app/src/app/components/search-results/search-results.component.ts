import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule, AsyncPipe, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BusinessSummaryDialogComponent } from '../business-summary-dialog/business-summary-dialog.component';
import { ApiService } from '../../api.service';
import { AuthService } from '@auth0/auth0-angular';


interface Business {
  business_id: string,
  name: string,
  address: string,
  city: string,
  state: string
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() businesses: Business[] = [];
  selectedBusiness: any;
  summary = '';
  loading = false;
  
  constructor(public auth: AuthService, private dialog: MatDialog, private apiService: ApiService) {};

  selectBusiness(business: any) {
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
        error: (error) => console.error('Error fetching summary:', error)
      });
    })
    
  }

  addToFavorites(business: any) {
    this.auth.user$.subscribe((user) => {
      if (user) {
        const userId = user.sub as string;
        const newFavorite = {
          name: business.name,
          id: business.business_id
        };

        this.apiService.updateFavoriteBusiness(userId, newFavorite).subscribe({
          next: (data: any) => {
          console.log('Updated favorites', data)
          },
          error: (error) => console.error('Error updating favorites', error)
        });
      } else {
        console.error('User not logged in')
      }
    });
  }
    
  openDialog(name: string, businessId: string, summary: string): void {
    const dialogRef = this.dialog.open(BusinessSummaryDialogComponent, {
      data: { name, businessId, summary }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetState();
    })
  }

  resetState() {
    this.summary = '';
    this.selectedBusiness = null;
  }
}

