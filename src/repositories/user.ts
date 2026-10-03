import type { User } from "../domain/user/entity.ts";
import type { UserRepository} from "../domain/user/repository.ts";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, "../data/user.json");

interface UserJson extends Omit<User, "createdAt"> {
    createdAt: string;
}

async function readUsersFile(): Promise<User[]> {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        if (!data.trim()) return [];
        
        const rawUsers: UserJson[] = JSON.parse(data);
        return rawUsers.map(u => ({
            ...u,
            createdAt: new Date(u.createdAt)
        }));
    } catch (error) {
        return [];
    }
}

async function writeUsersFile(users: User[]): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
}

export function createUserRepository(): UserRepository {
    return {
        async findById(id) {
            const users = await readUsersFile();
            return users.find((user) => user.id === id) || null;
        },

        async findByEmail(email) {
            const users = await readUsersFile();
            return users.find((user) => user.email === email) || null;
        },

        async createUser(user) {
            const users = await readUsersFile();
            users.push(user);
            await writeUsersFile(users);
            return user;
        }
    };
}