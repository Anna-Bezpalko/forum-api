import bcrypt from "bcryptjs";

export function createPasswordHasher() {
  return {
    hash(password: string): Promise<string> {
      return bcrypt.hash(password, 10);
    },

    compare(password: string, hashedPassword: string): Promise<boolean> {
      return bcrypt.compare(password, hashedPassword);
    },
  };
}

export type PasswordHasher = ReturnType<typeof createPasswordHasher>;
