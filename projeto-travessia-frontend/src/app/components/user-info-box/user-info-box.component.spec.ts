import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoBoxComponent } from './user-info-box.component';

describe('UserInfoBoxComponent', () => {
  let component: UserInfoBoxComponent;
  let fixture: ComponentFixture<UserInfoBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoBoxComponent]
    });
    fixture = TestBed.createComponent(UserInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
