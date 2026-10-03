import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import type { Task } from '../domain/task/entity.js';
import type { CreateTaskRequest, UpdateTaskRequest } from '../services/task/tasks.types.js';

export interface ITaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(dto: CreateTaskRequest): Promise<Task>;
  update(id: string, dto: UpdateTaskRequest): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  private readonly filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || path.join(process.cwd(), 'data', 'tasks.json');
  }

  private async readData(): Promise<Task[]> {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      if (!content.trim()) {
        return [];
      }
      return JSON.parse(content) as Task[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await this.ensureFileExists();
        return [];
      }
      throw error;
    }
  }

  private async writeData(tasks: Task[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(tasks, null, 2), 'utf-8');
  }

  private async ensureFileExists(): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, '[]', 'utf-8');
    }
  }

  async findAll(): Promise<Task[]> {
    return this.readData();
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.readData();
    const task = tasks.find((t) => t.id === id);
    return task || null;
  }

  async create(dto: CreateTaskRequest): Promise<Task> {
    const tasks = await this.readData();
    const now = new Date().toISOString();

    const newTask: Task = {
      id: crypto.randomUUID(),
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    await this.writeData(tasks);
    return newTask;
  }

  async update(id: string, dto: UpdateTaskRequest): Promise<Task | null> {
    const tasks = await this.readData();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...tasks[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    await this.writeData(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = await this.readData();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return false;
    }

    tasks.splice(index, 1);
    await this.writeData(tasks);
    return true;
  }
}