import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuardFn } from '@auth0/auth0-angular';

export const routes: Routes = [
    {
        path: '',
        component: SearchComponent,
        pathMatch: 'full',
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuardFn]
    }
];
