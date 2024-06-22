import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from '../../api.service';

interface Business {
  business_id: string,
  name: string,
  address: string
}


@Component({
  selector: 'app-business-summary-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './business-summary-dialog.component.html',
  styleUrl: './business-summary-dialog.component.css'
})
export class BusinessSummaryDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, businessId: string, summary: string }, public auth: AuthService, private apiService: ApiService) {}
  
  addToFavorites(businessName: string, businessId: string) {
    this.auth.user$.subscribe((user) => {
      if (user) {
        const userId = user.sub as string;
        const newFavorite = {
          name: businessName,
          id: businessId
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
}


