import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { RefreshToken, refreshTokens, users } from "../schema.js";

export async function createRefreshToken(refreshToken: RefreshToken) {
    const [result] = await db
            .insert(refreshTokens)
            .values(refreshToken)
            .returning();
        return result;
}

export async function getRefreshToken(token: string) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    return result;
}

export async function getUserFromRefreshToken(refreshToken: string) {
    const [result] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
        .where(
            and(
                eq(refreshTokens.token, refreshToken),
                isNull(refreshTokens.revokedAt),
                gt(refreshTokens.expiresAt, new Date()),
            ),
        )
        .limit(1);
    return result;
}

export async function revokeRefreshToken(token: string) {
    await db.update(refreshTokens).set({
        updatedAt: new Date(),
        revokedAt: new Date(),
    }).where(eq(refreshTokens.token, token));
}