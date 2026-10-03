import type { User } from "../../domain/user/entity.js";

export type RegisterInput = Pick<User, "name" | "email" | "password">;
export type LoginInput = Pick<User, "email" | "password">;
export type SafeUser = Omit<User, "password">;