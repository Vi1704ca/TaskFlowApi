import { Router } from "express";
import { createTaskHandler } from "../handlers/task.js";
import type { TaskService } from "../../services/task/task.js";

export function createTaskRouter(taskService: TaskService) {
  const router = Router();
  const taskHandler = createTaskHandler(taskService);

  router.get("/tasks", taskHandler.getAll);
  router.post("/tasks", taskHandler.create);
  router.get("/tasks/:id", taskHandler.getById);
  router.patch("/tasks/:id", taskHandler.update);
  router.delete("/tasks/:id", taskHandler.delete);

  return router;
}
