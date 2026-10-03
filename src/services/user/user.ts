import type { UserRepository } from "../../domain/user/repository.ts";
import type { RegisterInput, LoginInput, SafeUser } from "./user.types.ts";
import type { User } from "../../domain/user/entity.ts";

export function createUserService(userRepository: UserRepository) {
    return {
        async register(input: RegisterInput): Promise<SafeUser> {
            const existingUser = await userRepository.findByEmail(input.email);
            if (existingUser) {
                throw new Error("Пользователь с таким email уже существует");
            }

            const newUser: User = {
                id: Date.now(),
                name: input.name,
                email: input.email,
                password: input.password,
                createdAt: new Date(),
            };

            await userRepository.createUser(newUser);

            const { password, ...safeUser } = newUser;
            return safeUser;
        },

        async login(input: LoginInput): Promise<SafeUser> {
            const user = await userRepository.findByEmail(input.email);
            if (!user) {
                throw new Error("Неверный email или пароль");
            }

            if (user.password !== input.password) {
                throw new Error("Неверный email или пароль");
            }

            const { password, ...safeUser } = user;
            return safeUser;
        },
    };
}