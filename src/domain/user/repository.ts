import type { User } from "./entity.js";

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
}