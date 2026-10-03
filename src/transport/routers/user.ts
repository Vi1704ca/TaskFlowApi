import { Router } from "express";
import { createUserHandler } from "../handlers/user.js";
import type { UserService } from "../../services/user/user.js";

export function createUserRouter(userService: UserService) {
  const router = Router();
  const userHandler = createUserHandler(userService);

  router.post("/auth/register", userHandler.register);
  router.post("/auth/login", userHandler.login);
  router.get("/users/:id", userHandler.getById);

  return router;
}
