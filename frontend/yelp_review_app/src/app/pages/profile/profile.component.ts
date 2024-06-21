import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, CommonModule, JsonPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from '../../api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe, NgIf, JsonPipe, CommonModule],
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
}
