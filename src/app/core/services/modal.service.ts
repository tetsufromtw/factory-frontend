// src/app/core/services/modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../../shared/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private employeeSubject = new BehaviorSubject<Employee | null>(null);
  public employee$: Observable<Employee | null> = this.employeeSubject.asObservable();

  open(employee: Employee): void {
    this.employeeSubject.next(employee);
  }

  close(): void {
    this.employeeSubject.next(null);
  }
}