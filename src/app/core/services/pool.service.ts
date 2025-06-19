// src/app/core/services/pool.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pool } from '../../shared/models/pool.model';
import { ApiService } from './api.service';

export interface MoveEmployeeRequest {
  fromPoolId: string;
  toPoolId: string;
  employeeIndex: number;
  targetIndex: number;
}

export interface MoveEmployeeResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoolService {
  private poolsSubject = new BehaviorSubject<Pool[]>([]);
  public pools$ = this.poolsSubject.asObservable();

  constructor(private api: ApiService) {}

  loadPools(): Observable<Pool[]> {
    return this.api.get<Pool[]>('/pools').pipe(
      tap(pools => this.poolsSubject.next(pools))
    );
  }

  moveEmployee(data: MoveEmployeeRequest): Observable<MoveEmployeeResponse> {
    return this.api.post<MoveEmployeeResponse>('/assignments/move', data);
  }

  updateLocalPools(pools: Pool[]): void {
    this.poolsSubject.next(pools);
  }

  get currentPools(): Pool[] {
    return this.poolsSubject.getValue();
  }
}