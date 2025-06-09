// src/app/shared/models/employee.model.ts
export interface Employee {
  id: number;
  name: string;
  position: string;
  emoji: string;
  status: 'active' | 'absent' | 'busy';  // [TODO] Use enum for status or Status definition file?
}