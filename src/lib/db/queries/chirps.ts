import { asc, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps, users } from "../schema.js";

export async function createChirp(chirp: Chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getAllChirps(authorId: string, sortBy: string) {
    const result = await db
        .select()
        .from(chirps)
        .where(authorId ? eq(chirps.userId, authorId) : undefined)
        .orderBy(sortBy === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt));
    return result;
}

export async function getChirpById(id: string){
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result;
}

export async function deleteChripByID(id: string) {
    await db.delete(chirps).where(eq(chirps.id, id));
}