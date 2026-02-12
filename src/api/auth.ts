import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./errors.js";

export async function hashPassword(password: string): Promise<string>{
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    if(!password) return false;
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string{
    const payload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now()/1000),
        exp: Math.floor(Date.now()/1000) + expiresIn,
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string{
    try {
        const decoded = jwt.verify(tokenString, secret) as JwtPayload;
        if(!decoded.sub){
            throw new Error("No sub in payload");
        }
        return decoded.sub;
    } catch (err) {
        if(err instanceof jwt.TokenExpiredError){
            throw err;
        } else if(err instanceof jwt.NotBeforeError){
            throw new UnauthorizedError(`${err.message}\nDate: ${err.date}`);
        } 
        
        throw new UnauthorizedError("Invalid token");
    }
} 