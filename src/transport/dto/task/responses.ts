import type { Task } from "../../../domain/task/entity.js";

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export function mapToTaskResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    status: task.status,
    userId: task.userId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

