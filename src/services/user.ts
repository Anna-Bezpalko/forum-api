import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import type { User, NewUser } from "../domain/user/entity.js"; 
import type { UserRepository } from "../domain/user/repository.js";

const JWT_SECRET = process.env.JWT_SECRET;

export interface UserService { 
    register(newUser: NewUser): Promise<User>; 
    login(email: string, password: string): Promise<User>; 
    createToken(user: User): string; 
}

export function createUserService(repository: UserRepository): UserService { 
    return { 
        async register(newUser: NewUser): Promise<User> { 
            const existingUser = await repository.getByEmail(newUser.email);

            if (existingUser) {
                throw new Error("EMAIL_ALREADY_EXISTS");
            }

            const hashedPassword = await bcrypt.hash(newUser.password, 10);

            return repository.addUser({
                name: newUser.name,
                email: newUser.email,
                password: hashedPassword,
            });
        },

        async login(email: string, password: string): Promise<User> {
            const user = await repository.getByEmail(email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error("INVALID_CREDENTIALS");
            }

            return user;
        },

        createToken(user: User): string {
            if (!JWT_SECRET) {
                throw new Error("JWT_SECRET is not configured");
            }

            return jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" },
            );
        },
    }; 
}