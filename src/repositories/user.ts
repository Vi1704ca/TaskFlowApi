import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { User } from "../domain/user/entity.js";
import type { UserRepository } from "../domain/user/repository.js";

const filePath = path.resolve(process.cwd(), "data", "users.json");

async function readUsers(): Promise<User[]> {
  try {
    const content = await readFile(filePath, "utf-8");
    if (!content.trim()) return [];
    const users = JSON.parse(content) as Array<User & { createdAt: string }>;
    return users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    }));
  } catch {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, "[]", "utf-8");
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
}

export function createUserRepository(): UserRepository {
  return {
    async findById(id: number) {
      const users = await readUsers();
      return users.find((user) => user.id === id) ?? null;
    },

    async findByEmail(email: string) {
      const users = await readUsers();
      return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
    },

    async createUser(user: User) {
      const users = await readUsers();
      users.push(user);
      await writeUsers(users);
      return user;
    },
  };
}