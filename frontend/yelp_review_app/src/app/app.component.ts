import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthLoginButtonComponent } from './components/auth-login-button/auth-login-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthLoginButtonComponent, RouterOutlet, SearchFormComponent, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'yelp_review_app';
}
