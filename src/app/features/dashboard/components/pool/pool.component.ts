// src/app/features/dashboard/components/pool/pool.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pool } from '../../../../shared/models/pool.model';
import { Employee } from '../../../../shared/models/employee.model';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';

export interface DragDropData {
  fromPoolId: string;
  toPoolId: string;
  employeeIndex: number;
  targetIndex: number;
}

@Component({
  selector: 'app-pool',
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent],
  templateUrl: './pool.component.html'
})
export class PoolComponent {
  @Input() pool!: Pool;
  @Input() draggedData: { poolId: string; index: number } | null = null;
  @Output() dragStart = new EventEmitter<{ poolId: string; index: number }>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() drop = new EventEmitter<DragDropData>();

  dragOverIndex: number | null = null;

  get isProductionPool(): boolean {
    return this.pool.type === 'production';
  }

  get poolCapacityText(): string {
    if (this.pool.maxCapacity) {
      return `${this.pool.employees.length} / ${this.pool.maxCapacity}`;
    }
    return `${this.pool.employees.length} 名`;
  }

  get isOverCapacity(): boolean {
    return this.pool.maxCapacity ? this.pool.employees.length > this.pool.maxCapacity : false;
  }

  getStatusCount(status: string): number {
    return this.pool.employees.filter(e => e.status === status).length;
  }

  getPlaceholders(): number[] {
    if (!this.pool.maxCapacity || this.pool.type === 'unassigned') {
      return [];
    }
    const emptySlots = Math.max(0, this.pool.maxCapacity - this.pool.employees.length);
    return Array(emptySlots).fill(0);
  }

  onDragStart(event: DragEvent, index: number): void {
    this.dragStart.emit({ poolId: this.pool.id, index });
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', '');
  }

  onDragEnd(): void {
    this.dragEnd.emit();
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverIndex = index;
  }

  onDragLeave(): void {
    this.dragOverIndex = null;
  }

  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    
    if (this.draggedData) {
      this.drop.emit({
        fromPoolId: this.draggedData.poolId,
        toPoolId: this.pool.id,
        employeeIndex: this.draggedData.index,
        targetIndex
      });
    }
    
    this.dragOverIndex = null;
  }

  onDropOnPool(event: DragEvent): void {
    event.preventDefault();
    
    if (this.draggedData && this.draggedData.poolId !== this.pool.id) {
      this.drop.emit({
        fromPoolId: this.draggedData.poolId,
        toPoolId: this.pool.id,
        employeeIndex: this.draggedData.index,
        targetIndex: this.pool.employees.length
      });
    }
  }

  isDraggingFromThisPool(index: number): boolean {
    return this.draggedData?.poolId === this.pool.id && this.draggedData?.index === index;
  }
}