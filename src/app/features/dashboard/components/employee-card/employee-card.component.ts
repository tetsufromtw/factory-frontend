// src/app/features/dashboard/components/employee-card/employee-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../shared/models/employee.model';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-card.component.html'
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Input() isDragging: boolean = false;
  @Input() isDragOver: boolean = false;

  getStatusClasses(): string {
    const baseClasses = 'absolute top-3 right-3 w-6 h-6 flex items-center justify-center';
    return baseClasses;
  }

  getStatusDotClasses(): string {
    const statusColors = {
      'active': 'bg-green-500 shadow-green-200',
      'absent': 'bg-gray-400 shadow-gray-200',
      'busy': 'bg-red-500 shadow-red-200'
    };
    
    const color = statusColors[this.employee.status] || statusColors['active'];
    return `w-2.5 h-2.5 rounded-full ${color} shadow-[0_0_0_3px]`;
  }

  getStatusText(): string {
    const statusMap: {[key: string]: string} = {
      'active': '出勤',
      'absent': '欠勤',
      'busy': '取込み中'
    };
    return statusMap[this.employee.status] || '';
  }
}