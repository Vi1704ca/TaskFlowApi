import { ITaskRepository } from '../../repositories/task.js';
import { Task } from '../../domain/task/entity.js';
import { CreateTaskRequest, UpdateTaskRequest, IUserRepository } from './tasks.types.js';

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task with id "${id}" not found`);
    this.name = 'TaskNotFoundError';
  }
}

export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User with id "${userId}" not found`);
    this.name = 'UserNotFoundError';
  }
}

export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getById(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }
    return task;
  }

  async getAll(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async create(dto: CreateTaskRequest): Promise<Task> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundError(dto.userId);
    }
    return this.taskRepository.create(dto);
  }

  async update(id: string, dto: UpdateTaskRequest): Promise<Task> {
    const updatedTask = await this.taskRepository.update(id, dto);
    if (!updatedTask) {
      throw new TaskNotFoundError(id);
    }
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new TaskNotFoundError(id);
    }
  }
}