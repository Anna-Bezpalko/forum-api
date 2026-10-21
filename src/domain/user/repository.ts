import type { User, NewUser } from "./entity.js";

export interface UserRepository {
  getByEmail(email: string): Promise<User | undefined>;
  addUser(newUser: NewUser): Promise<User>;
}