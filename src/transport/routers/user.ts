import { Router } from 'express';
import { UserHandler } from '../handlers/user.js';
import { UserService } from '../../services/user.service.js';

const userRouter = Router();

const userService = new UserService();
const userHandler = new UserHandler(userService);

userRouter.post('/auth/register', userHandler.register);
userRouter.post('/auth/login', userHandler.login);
userRouter.get('/users/:id', userHandler.getById);

export { userRouter };
