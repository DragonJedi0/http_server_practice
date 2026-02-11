import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";

export async function createChirp(chirp: Chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getAllChirps() {
    const result = await db.select().from(chirps);
    return result;
}

export async function getChirpById(id: string){
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result;
}