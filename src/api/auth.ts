import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { Request } from "express";
import { config } from "../config.js";

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
        iss: config.jwt.issuer,
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

export function getBearerToken(req: Request): string{
    const authHeader = req.get("Authorization");
    if(!authHeader){
        throw new BadRequestError("Malformed authorization header");
    }
    return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string): string{
    const splitAuth = header.split(" ");
    if(splitAuth.length < 2 || splitAuth.length > 2 || splitAuth[0] !== "Bearer"){
        throw new BadRequestError("Malformed authorization header");
    }
    return splitAuth[1];
}

export function makeRefreshToken(){
    const buff = crypto.randomBytes(32);
    const hex = buff.toString('hex');
    const expiresInDays = new Date(Date.now() + ((3600 * 24) * 60) * 1000); // Date.now() + (((1 hour in seconds * 24) * 60 days) * 1000 milliseconds)

    return {
        token: hex,
        expiration: expiresInDays
    }
}