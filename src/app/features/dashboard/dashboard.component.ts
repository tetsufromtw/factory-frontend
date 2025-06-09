// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../shared/models/employee.model';
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  employees: Employee[] = [
    {
      id: 1,
      name: '千葉さん',
      position: 'エンジニア',
      emoji: '👤',
      status: 'active'
    },
    {
      id: 2,
      name: '梁さん',
      position: 'デザイナー',
      emoji: '👤',
      status: 'active'
    },
    {
      id: 3,
      name: '鈴木さん',
      position: 'マネージャー',
      emoji: '👤',
      status: 'busy'
    },
    {
      id: 4,
      name: '武田さん',
      position: 'エンジニア',
      emoji: '👤',
      status: 'absent'
    },
    {
      id: 5,
      name: '田中さん',
      position: 'アナリスト',
      emoji: '👤',
      status: 'active'
    }
  ];

  draggedIndex: number | null = null;
  dragOverIndex: number | null = null;

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'active': '出勤',
      'absent': '欠勤',
      'busy': '取込み中'
    };
    return statusMap[status] || '';
  }

  getPlaceholders(): number[] {
    const totalSlots = 9;
    const emptySlots = totalSlots - this.employees.length;
    return Array(emptySlots).fill(0);
  }

  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex = index;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/html', '');
  }

  onDragEnd(): void {
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverIndex = index;
  }

  onDragLeave(): void {
    this.dragOverIndex = null;
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      const draggedEmployee = this.employees[this.draggedIndex];
      const newEmployees = [...this.employees];
      
      newEmployees.splice(this.draggedIndex, 1);
      
      const adjustedDropIndex = dropIndex > this.draggedIndex ? dropIndex - 1 : dropIndex;
      newEmployees.splice(adjustedDropIndex, 0, draggedEmployee);
      
      this.employees = newEmployees;
    }
    
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }
}