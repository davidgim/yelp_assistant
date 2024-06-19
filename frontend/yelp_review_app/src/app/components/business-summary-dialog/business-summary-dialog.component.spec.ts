import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSummaryDialogComponent } from './business-summary-dialog.component';

describe('BusinessSummaryDialogComponent', () => {
  let component: BusinessSummaryDialogComponent;
  let fixture: ComponentFixture<BusinessSummaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSummaryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
