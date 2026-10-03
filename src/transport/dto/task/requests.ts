import type { TaskPriority, TaskStatus } from "../../../domain/task/entity.js";

export interface TaskRequest {
  userId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}