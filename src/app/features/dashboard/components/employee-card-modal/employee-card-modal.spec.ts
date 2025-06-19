import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCardModal } from './employee-card-modal';

describe('EmployeeCardModal', () => {
  let component: EmployeeCardModal;
  let fixture: ComponentFixture<EmployeeCardModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCardModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCardModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
