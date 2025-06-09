// src/app/shared/models/pool.model.ts
import { Employee } from './employee.model';

export interface Pool {
  id: string;
  name: string;
  type: 'production' | 'unassigned';
  employees: Employee[];
  maxCapacity?: number;
}