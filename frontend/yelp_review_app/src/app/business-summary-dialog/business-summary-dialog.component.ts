import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-business-summary-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './business-summary-dialog.component.html',
  styleUrl: './business-summary-dialog.component.css'
})
export class BusinessSummaryDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string; summary: string }) {}
}
