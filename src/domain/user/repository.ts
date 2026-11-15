import type { User, NewUser } from "./entity.js";

export interface UserRepository {
  getById(id: number): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  addUser(newUser: NewUser): Promise<User>;
}