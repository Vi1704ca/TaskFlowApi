import type { Request, Response, NextFunction } from 'express';
import { TaskService } from '../../services/task.service.js';
import { mapToTaskResponse } from '../dto/task/responses.js';
import { CreateTaskDto } from '../dto/task/create-task.dto.js';
import { UpdateTaskDto } from '../dto/task/update-task.dto.js';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class TaskHandler {
  constructor(private readonly taskService: TaskService) {}

  // GET /tasks (Список)
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const userId = req.user?.id; 

      const { tasks, total } = await this.taskService.findMany({ userId, limit, offset });

      res.status(200).json({
        items: tasks.map(mapToTaskResponse),
        total,
        limit,
        offset,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToInstance(CreateTaskDto, req.body);
      await validateOrReject(dto);

      const userId = req.user!.id;
      const newTask = await this.taskService.create({ ...dto, userId });

      res.status(201).json(mapToTaskResponse(newTask));
    } catch (error) {
      res.status(400).json({ message: 'Validation failed', errors: error });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await this.taskService.getById(id);

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json(mapToTaskResponse(task));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const dto = plainToInstance(UpdateTaskDto, req.body);
      await validateOrReject(dto);

      const updatedTask = await this.taskService.update(id, dto);
      res.status(200).json(mapToTaskResponse(updatedTask));
    } catch (error) {
      res.status(400).json({ message: 'Validation failed', errors: error });
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.taskService.delete(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
