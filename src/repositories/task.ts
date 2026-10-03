import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Task, TaskPriority, TaskStatus } from "../domain/task/entity.js";
import type { TaskRepository } from "../domain/task/repository.js";

const filePath = path.resolve(process.cwd(), "data", "tasks.json");

async function readTasks(): Promise<Task[]> {
  try {
    const content = await readFile(filePath, "utf-8");
    if (!content.trim()) return [];
    const tasks = JSON.parse(content) as Array<Task & { createdAt: string; updatedAt: string }>;
    return tasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, "[]", "utf-8");
    return [];
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
}

export function createTaskRepository(): TaskRepository {
  return {
    async findAll(filters) {
      const tasks = await readTasks();
      return tasks.filter((task) => {
        if (filters?.userId !== undefined && task.userId !== filters.userId) return false;
        if (filters?.status !== undefined && task.status !== filters.status) return false;
        if (filters?.priority !== undefined && task.priority !== filters.priority) return false;
        return true;
      });
    },

    async findById(id: string) {
      const tasks = await readTasks();
      return tasks.find((task) => task.id === id) ?? null;
    },

    async create(task: Task) {
      const tasks = await readTasks();
      tasks.push(task);
      await writeTasks(tasks);
      return task;
    },

    async update(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) {
      const tasks = await readTasks();
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) return null;

      const updatedTask = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date(),
      } as Task;

      tasks[index] = updatedTask;
      await writeTasks(tasks);
      return updatedTask;
    },

    async delete(id: string) {
      const tasks = await readTasks();
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) return false;

      tasks.splice(index, 1);
      await writeTasks(tasks);
      return true;
    },
  };
}