import express from "express";
import { createUserRepository } from "./repositories/user.js";
import { createTaskRepository } from "./repositories/task.js";
import { UserService } from "./services/user/user.js";
import { TaskService } from "./services/task/task.js";
import { createUserRouter } from "./transport/routers/user.js";
import { createTaskRouter } from "./transport/routers/task.js";

const app = express();
const HOST = "localhost";
const PORT = 3000;

app.use(express.json());

const userRepository = createUserRepository();
const taskRepository = createTaskRepository();

const userService = new UserService(userRepository);
const taskService = new TaskService(taskRepository, userRepository);

app.use(createUserRouter(userService));
app.use(createTaskRouter(taskService));

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});