import { db } from "../index.js";
import { Post, posts } from "../schema.js";

export async function createPost(post: Post) {
    const [result] = await db
        .insert(posts)
        .values(post)
        .onConflictDoNothing()
        .returning();
    return result;
}