import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuichePage } from './guiche.page';

describe('GuichePage', () => {
  let component: GuichePage;
  let fixture: ComponentFixture<GuichePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuichePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
