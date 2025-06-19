// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Pool } from '../../shared/models/pool.model';
import { PoolComponent, DragDropData } from './components/pool/pool.component';
import { PoolService } from '../../core/services/pool.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PoolComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  pools: Pool[] = [];
  draggedData: { poolId: string; index: number } | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private poolService: PoolService) {}

  ngOnInit(): void {
    this.loadPools();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPools(): void {
    this.isLoading = true;
    this.poolService.loadPools()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pools) => {
          this.pools = pools;
          this.isLoading = false;
          this.error = null;
        },
        error: (error) => {
          this.error = 'Failed to load pools. Please try again.';
          this.isLoading = false;
          console.error('Error loading pools:', error);
        }
      });
  }

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
    const originalPools = [...this.pools];
    const newPools = [...this.pools];
    const fromPool = newPools.find(p => p.id === data.fromPoolId);
    const toPool = newPools.find(p => p.id === data.toPoolId);

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

    this.pools = newPools;
    this.poolService.updateLocalPools(newPools);

    this.poolService.moveEmployee(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.success) {
            throw new Error(response.message);
          }
        },
        error: (error) => {
          this.pools = originalPools;
          this.poolService.updateLocalPools(originalPools);
          this.error = 'Failed to move employee. Please try again.';
          console.error('Error moving employee:', error);
        }
      });
  }

  dismissError(): void {
    this.error = null;
  }
}