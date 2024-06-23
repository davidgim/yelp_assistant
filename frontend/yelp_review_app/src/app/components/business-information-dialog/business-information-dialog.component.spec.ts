import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInformationDialogComponent } from './business-information-dialog.component';

describe('BusinessInformationDialogComponent', () => {
  let component: BusinessInformationDialogComponent;
  let fixture: ComponentFixture<BusinessInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessInformationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
