import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteConfirmationDialogComponent } from './overwrite-confirmation-dialog.component';

describe('OverwriteConfirmationDialogComponent', () => {
  let component: OverwriteConfirmationDialogComponent;
  let fixture: ComponentFixture<OverwriteConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverwriteConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(OverwriteConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
