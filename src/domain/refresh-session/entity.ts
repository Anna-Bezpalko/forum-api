export interface RefreshSession {
    id: number;
    userId: number;
    tokenHash: string;
    jwtId: string;
    expiresAt: Date;
    createdAt: Date;
}

export type NewRefreshSession = Omit<RefreshSession, "id" | "createdAt">;