import type { Request, Response } from "express";
import type { UserService } from "../../services/user/user.js";

export function createUserHandler(userService: UserService) {
  return {
    async register(req: Request, res: Response) {
      try {
        const { name, email, password } = req.body ?? {};

        if (!name || !email || !password) {
          res.status(400).json({ message: "name, email and password are required" });
          return;
        }

        const user = await userService.register({ name, email, password });
        res.status(201).json(user);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed";
        res.status(409).json({ message });
      }
    },

    async login(req: Request, res: Response) {
      try {
        const { email, password } = req.body ?? {};

        if (!email || !password) {
          res.status(400).json({ message: "email and password are required" });
          return;
        }

        const user = await userService.login({ email, password });
        res.status(200).json(user);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        res.status(401).json({ message });
      }
    },

    async getById(req: Request, res: Response) {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        res.status(400).json({ message: "Invalid user id" });
        return;
      }

      const user = await userService.getById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(user);
    },
  };
}
