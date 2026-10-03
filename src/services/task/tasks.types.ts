import type { TaskStatus, TaskPriority } from '../domain/task/entity.js'

export interface CreateTaskRequest {
    userId: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}
