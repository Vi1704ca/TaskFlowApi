import { Router } from 'express';
import { TaskHandler } from '../handlers/task.js';
import { TaskService } from '../../services/task.service.js';

const taskRouter = Router();

const taskService = new TaskService();
const taskHandler = new TaskHandler(taskService);

taskRouter.get('/', taskHandler.getAll);
taskRouter.post('/', taskHandler.create);
taskRouter.get('/:id', taskHandler.getById);
taskRouter.patch('/:id', taskHandler.update);
taskRouter.delete('/:id', taskHandler.delete);

export { taskRouter };
