import { randomUUID } from "node:crypto";
import type { UserRepository } from "../../domain/user/repository.js";
import type { Task } from "../../domain/task/entity.js";
import type { TaskRepository } from "../../domain/task/repository.js";
import type { CreateTaskRequest, UpdateTaskRequest } from "./tasks.types.js";

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task with id "${id}" not found`);
    this.name = "TaskNotFoundError";
  }
}

export class UserNotFoundError extends Error {
  constructor(userId: number) {
    super(`User with id "${userId}" not found`);
    this.name = "UserNotFoundError";
  }
}

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getById(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }

  async getAll(filters?: { userId?: number; status?: string; priority?: string }): Promise<Task[]> {
    return this.taskRepository.findAll(filters as any);
  }

  async create(dto: CreateTaskRequest): Promise<Task> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new UserNotFoundError(dto.userId);

    const now = new Date();
    const task: Task = {
      id: randomUUID(),
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      createdAt: now,
      updatedAt: now,
    };

    return this.taskRepository.create(task);
  }

  async update(id: string, dto: UpdateTaskRequest): Promise<Task> {
    const updatedTask = await this.taskRepository.update(id, dto as Partial<Omit<Task, "id" | "createdAt">>);
    if (!updatedTask) throw new TaskNotFoundError(id);
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) throw new TaskNotFoundError(id);
  }
}