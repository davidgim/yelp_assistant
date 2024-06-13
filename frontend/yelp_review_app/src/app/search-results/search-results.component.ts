import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BusinessSummaryDialogComponent } from '../business-summary-dialog/business-summary-dialog.component';
import { ApiService } from '../api.service';


interface Business {
  business_id: string,
  name: string
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() businesses: Business[] = [];
  selectedBusiness: any;
  summary = '';
  
  constructor(private dialog: MatDialog, private apiService: ApiService) {};
  selectBusiness(business: any) {
    this.selectedBusiness = business;
    this.apiService.summarizeBusiness(business.business_id).subscribe({
      next: (data: string) => {
        this.summary = data;
      },
      error: (error) => console.error('Error fetching summary:', error)
    });
    this.openDialog(business.name, this.summary);
  }

  openDialog(name: string, summary: string): void {
    this.dialog.open(BusinessSummaryDialogComponent, {
      data: { name, summary }
    });
  }
}

