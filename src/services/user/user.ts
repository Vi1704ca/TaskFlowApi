import type { User } from "../../domain/user/entity.js";
import type { UserRepository } from "../../domain/user/repository.js";
import type { LoginInput, RegisterInput, SafeUser } from "./user.types.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterInput): Promise<SafeUser> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser: User = {
      id: Date.now(),
      name: input.name,
      email: input.email,
      password: input.password,
      createdAt: new Date(),
    };

    await this.userRepository.createUser(newUser);

    const { password: _password, ...safeUser } = newUser;
    return safeUser;
  }

  async login(input: LoginInput): Promise<SafeUser> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.password !== input.password) {
      throw new Error("Invalid email or password");
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async getById(id: number): Promise<SafeUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}