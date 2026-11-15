import type { RefreshSession, NewRefreshSession } from "../domain/refresh-session/entity.js";
import type { RefreshSessionRepository } from "../domain/refresh-session/repository.js";
import { db } from "../prisma/db.js";

export function createRefreshSessionRepository(): RefreshSessionRepository {
    return {
        async addSession(session: NewRefreshSession): Promise<RefreshSession> {
            return await db.orm.public.RefreshSession.create(session);
        },

        async getByTokenHash(tokenHash: string): Promise<RefreshSession | undefined> {
            const session = await db.orm.public.RefreshSession.first({ tokenHash });
            return session ?? undefined;
        },

        async deleteByTokenHash(tokenHash: string): Promise<void> {
            await db.orm.public.RefreshSession
                .where({ tokenHash })
                .delete();
        },
    };
}