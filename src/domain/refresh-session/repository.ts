import type { RefreshSession, NewRefreshSession } from "./entity.js";

export interface RefreshSessionRepository {
    addSession(session: NewRefreshSession): Promise<RefreshSession>;
    getByTokenHash(tokenHash: string): Promise<RefreshSession | undefined>;
    deleteByTokenHash(tokenHash: string): Promise<void>;
}