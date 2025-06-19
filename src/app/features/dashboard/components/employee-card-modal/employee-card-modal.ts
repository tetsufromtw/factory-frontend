// src/app/features/dashboard/components/employee-card-modal/employee-card-modal.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Employee } from '../../../../shared/models/employee.model';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-employee-card-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-card-modal.html',
  styleUrl: './employee-card-modal.css'
})
export class EmployeeCardModal implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  employee: Employee | null = null;

  constructor(private modalService: ModalService) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.employee) {
      this.modalService.close();
    }
  }

  ngOnInit(): void {
    this.modalService.employee$
      .pipe(takeUntil(this.destroy$))
      .subscribe(employee => {
        this.employee = employee;
        if (employee) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.style.overflow = '';
  }

  onBackdropClick(): void {
    this.modalService.close();
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }
  closeModal(): void {
    this.modalService.close();
  }
}