import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordResponseComponent } from './reset-password-response.component';

describe('ResetPasswordResponseComponent', () => {
  let component: ResetPasswordResponseComponent;
  let fixture: ComponentFixture<ResetPasswordResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
