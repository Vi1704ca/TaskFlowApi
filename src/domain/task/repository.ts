import type { Task, TaskPriority, TaskStatus } from './entity.js';

export interface TaskRepository {
  findAll(filters?: { userId?: number; status?: TaskStatus; priority?: TaskPriority }): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}