import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-business-information-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './business-information-dialog.component.html',
  styleUrl: './business-information-dialog.component.css'
})
export class BusinessInformationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, address: string, city: string, state: string}) {}

}
