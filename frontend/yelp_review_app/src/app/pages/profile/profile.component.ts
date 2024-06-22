import { Component, OnInit, NgModule } from '@angular/core';
import { AsyncPipe, NgIf, CommonModule, JsonPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from '../../api.service';
import { environment } from '../../../environments/environment';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

interface Business {
  name: string;
  business_id: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AsyncPipe, 
    NgIf, 
    JsonPipe,
    CommonModule, 
    MatListModule, 
    MatIconModule, 
    MatFormFieldModule, 
    FormsModule, 
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileJson: string = '';
  domain = environment.auth0.domain;
  user: any;
  userId: string = '';
  favoriteBusinesses: any[] = [];
  dietaryRestrictions: string[] = [];
  newDietaryRestriction: string = '';
  constructor(private apiService: ApiService, public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.profileJson = JSON.stringify(user, null, 2);
        if (user.sub) {
          this.userId = user.sub;
        }
        this.loadUserMetadata();
      }
    });
  }

  loadUserMetadata(): void {
    this.apiService.getUserMetadata(this.userId).subscribe({
      next: (metadata) => {
        // const preMappedBusinesses = metadata.favorite_businesses || [];
        // this.favoriteBusinesses = preMappedBusinesses.map((business: Business) => business.name);
        this.favoriteBusinesses = metadata.favorite_businesses || [];
        this.dietaryRestrictions = metadata.dietary_restrictions || [];
      },
      error: (error) => {
        console.error('Failed to fetch user metadata:', error);
      }
    });
  }

  updateUserMetadata() {
    if (!this.userId) {
      return;
    }
    const metadata = {
      favorite_businesses: this.favoriteBusinesses,
      dietary_restrictions: this.dietaryRestrictions
    };

    this.apiService.updateUserMetadata(this.userId, metadata).subscribe({
      next: (response) => {
        console.log('User metadata updated successfully:', response);
      },
      error: (error) => {
        console.error('Failed to update user metadata:', error);
      }
    });
  }

  deleteFavoriteBusiness(business: Business) {
    this.apiService.deleteFavoriteBusiness(this.userId, business).subscribe({
      next: (respones) => {
        this.loadUserMetadata();
      },
      error: (error) => {
        console.error('Failed to delete business:', error);
      }
    })
  }

  addDietaryRestriction(dietaryRestriction: string): void {
    this.apiService.addDietaryRestriction(this.userId, dietaryRestriction).subscribe({
      next: (response) => {
        this.loadUserMetadata();
      },
      error: (error) => {
        console.error('Failed to add user dietary restriction:', error);
      }
    });
  }

  deleteDietaryRestriction(dietaryRestriction: string): void {
    this.apiService.deleteDietaryRestriction(this.userId, dietaryRestriction).subscribe({
      next: (response) => {
        this.loadUserMetadata();
      },
      error: (error) => {
        console.error('Failed to delete user dietary restriction:', error);
      }
    });
  }

  
}
