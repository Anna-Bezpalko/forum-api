import type { User, NewUser } from "../domain/user/entity.js"; 
import type { UserRepository } from "../domain/user/repository.js"; 
import { db } from "../prisma/db.js";

export function createUserRepository(): UserRepository { 
    return { 
        async getById(id: number): Promise<User | undefined> { 
            const user = await db.orm.public.User.first({ id }); 
            return user ?? undefined; 
        },

        async getByEmail(email: string): Promise<User | undefined> {
            const user = await db.orm.public.User.first({ email });
            return user ?? undefined;
        },

        async addUser(newUser: NewUser): Promise<User> {
            return await db.orm.public.User.create(newUser);
        },
    }; 
}