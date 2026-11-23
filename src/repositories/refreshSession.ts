import type {
  NewRefreshSession,
  RefreshSession,
} from "../domain/refresh-session/entity.js";
import type { RefreshSessionRepository } from "../domain/refresh-session/repository.js";
import type { Database } from "../prisma/db.js";

export function createRefreshSessionRepository(
  db: Database,
): RefreshSessionRepository {
  return {
    async addSession(session: NewRefreshSession): Promise<RefreshSession> {
      return await db.orm.public.RefreshSession.create(session);
    },

    async getByTokenHash(
      tokenHash: string,
    ): Promise<RefreshSession | undefined> {
      const session = await db.orm.public.RefreshSession.first({ tokenHash });
      return session ?? undefined;
    },

    async deleteByTokenHash(tokenHash: string): Promise<void> {
      await db.orm.public.RefreshSession.where({ tokenHash }).delete();
    },
  };
}
