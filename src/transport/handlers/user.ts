import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user.service.js';
import { RegisterUserDto } from '../dto/user/register.dto.js';
import { LoginUserDto } from '../dto/user/login.dto.js';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class UserHandler {
  constructor(private readonly userService: UserService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToInstance(RegisterUserDto, req.body);
      await validateOrReject(dto);

      const user = await this.userService.register(dto);
      
      // Никогда не отправляем пароль! Формируем безопасный ответ явным маппингом.
      const safeUser = { id: user.id, email: user.email, name: user.name };
      res.status(201).json(safeUser);
    } catch (error) {
      res.status(400).json({ message: 'Registration failed', errors: error });
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToInstance(LoginUserDto, req.body);
      await validateOrReject(dto);

      const { user, token } = await this.userService.login(dto);

      const safeUser = { id: user.id, email: user.email, name: user.name };
      res.status(200).json({ user: safeUser, token });
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getById(id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      next(error);
    }
  };
}
