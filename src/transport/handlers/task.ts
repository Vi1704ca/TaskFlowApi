import type { Request, Response } from "express";
import type { TaskService } from "../../services/task/task.js";

const VALID_STATUSES = new Set(["todo", "in_progress", "done"]);
const VALID_PRIORITIES = new Set(["low", "medium", "high"]);

export function createTaskHandler(taskService: TaskService) {
  return {
    async getAll(req: Request, res: Response) {
      const userId = req.query.userId !== undefined ? Number(req.query.userId) : undefined;
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;

      if (userId !== undefined && (!Number.isInteger(userId) || userId < 0)) {
        res.status(400).json({ message: "Invalid userId" });
        return;
      }

      if (status && !VALID_STATUSES.has(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }

      if (priority && !VALID_PRIORITIES.has(priority)) {
        res.status(400).json({ message: "Invalid priority" });
        return;
      }

      const filters: { userId?: number; status?: string; priority?: string } = {};
      if (userId !== undefined) filters.userId = userId;
      if (status !== undefined) filters.status = status;
      if (priority !== undefined) filters.priority = priority;

      const tasks = await taskService.getAll(filters);

      res.status(200).json(tasks);
    },

    async create(req: Request, res: Response) {
      try {
        const { userId, title, description, status, priority } = req.body ?? {};

        if (!userId || !title || !description || !status || !priority) {
          res.status(400).json({ message: "userId, title, description, status and priority are required" });
          return;
        }

        if (!VALID_STATUSES.has(status)) {
          res.status(400).json({ message: "Invalid status" });
          return;
        }

        if (!VALID_PRIORITIES.has(priority)) {
          res.status(400).json({ message: "Invalid priority" });
          return;
        }

        const task = await taskService.create({
          userId: Number(userId),
          title,
          description,
          status,
          priority,
        });

        res.status(201).json(task);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to create task";
        res.status(404).json({ message });
      }
    },

    async getById(req: Request, res: Response) {
      try {
        const id = typeof req.params.id === "string" ? req.params.id : "";
        if (!id) {
          res.status(400).json({ message: "Invalid task id" });
          return;
        }

        const task = await taskService.getById(id);
        res.status(200).json(task);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Task not found";
        res.status(404).json({ message });
      }
    },

    async update(req: Request, res: Response) {
      try {
        const id = typeof req.params.id === "string" ? req.params.id : "";
        if (!id) {
          res.status(400).json({ message: "Invalid task id" });
          return;
        }

        const { title, description, status, priority } = req.body ?? {};

        const updates: { title?: string; description?: string; status?: string; priority?: string } = {};
        if (title !== undefined) updates.title = String(title);
        if (description !== undefined) updates.description = String(description);
        if (status !== undefined) {
          if (!VALID_STATUSES.has(String(status))) {
            res.status(400).json({ message: "Invalid status" });
            return;
          }
          updates.status = String(status);
        }
        if (priority !== undefined) {
          if (!VALID_PRIORITIES.has(String(priority))) {
            res.status(400).json({ message: "Invalid priority" });
            return;
          }
          updates.priority = String(priority);
        }

        const task = await taskService.update(id, updates as any);
        res.status(200).json(task);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to update task";
        res.status(404).json({ message });
      }
    },

    async delete(req: Request, res: Response) {
      try {
        const id = typeof req.params.id === "string" ? req.params.id : "";
        if (!id) {
          res.status(400).json({ message: "Invalid task id" });
          return;
        }

        await taskService.delete(id);
        res.status(204).send();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to delete task";
        res.status(404).json({ message });
      }
    },
  };
}
