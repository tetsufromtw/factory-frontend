// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../shared/models/employee.model';
import { Pool } from '../../shared/models/pool.model';
import { PoolComponent, DragDropData } from './components/pool/pool.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PoolComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  pools: Pool[] = [
    {
      id: 'production-1',
      name: '產線 A',
      type: 'production',
      maxCapacity: 6,
      employees: [
        {
          id: 1,
          name: '林さん',
          position: 'エンジニア',
          emoji: '👨‍💻',
          status: 'active'
        },
        {
          id: 2,
          name: '陳さん',
          position: 'デザイナー',
          emoji: '👩‍🎨',
          status: 'active'
        }
      ]
    },
    {
      id: 'production-2',
      name: '產線 B',
      type: 'production',
      maxCapacity: 6,
      employees: [
        {
          id: 3,
          name: '王さん',
          position: 'マネージャー',
          emoji: '👨‍💼',
          status: 'busy'
        }
      ]
    },
    {
      id: 'unassigned',
      name: '未配置人員',
      type: 'unassigned',
      employees: [
        {
          id: 4,
          name: '張さん',
          position: 'エンジニア',
          emoji: '👩‍💻',
          status: 'absent'
        },
        {
          id: 5,
          name: '李さん',
          position: 'アナリスト',
          emoji: '👨‍🔬',
          status: 'active'
        },
        {
          id: 6,
          name: '黃さん',
          position: 'エンジニア',
          emoji: '👨‍💻',
          status: 'active'
        },
        {
          id: 7,
          name: '劉さん',
          position: 'デザイナー',
          emoji: '👩‍🎨',
          status: 'active'
        }
      ]
    }
  ];

  draggedData: { poolId: string; index: number } | null = null;

  get totalEmployees(): number {
    return this.pools.reduce((sum, pool) => sum + pool.employees.length, 0);
  }

  get activeEmployees(): number {
    return this.pools.reduce((sum, pool) => 
      sum + pool.employees.filter(e => e.status === 'active').length, 0
    );
  }

  onDragStart(data: { poolId: string; index: number }): void {
    this.draggedData = data;
  }

  onDragEnd(): void {
    this.draggedData = null;
  }

  onDrop(data: DragDropData): void {
    const fromPool = this.pools.find(p => p.id === data.fromPoolId);
    const toPool = this.pools.find(p => p.id === data.toPoolId);

    if (!fromPool || !toPool) return;

    const employee = fromPool.employees[data.employeeIndex];
    if (!employee) return;

    fromPool.employees.splice(data.employeeIndex, 1);

    if (data.fromPoolId === data.toPoolId) {
      const adjustedIndex = data.targetIndex > data.employeeIndex ? 
        data.targetIndex - 1 : data.targetIndex;
      toPool.employees.splice(adjustedIndex, 0, employee);
    } else {
      toPool.employees.splice(data.targetIndex, 0, employee);
    }

    this.pools = [...this.pools];
  }
}