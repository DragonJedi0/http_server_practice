import { beforeAll, describe, expect, it, vi } from "vitest";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, validateJWT } from "../auth.js";
import { BadRequestError, UnauthorizedError } from "../errors.js";
import jwt from "jsonwebtoken";
import { Request } from "express";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword465!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password2, hash2);
        expect(result).toBe(true);
    });

    it("should return false for the incorrect password", async () => {
        const result = await checkPasswordHash(password2, hash1);
        expect(result).toBe(false);
    });

    it("should return false for the incorrect password", async () => {
        const result = await checkPasswordHash(password1, hash2);
        expect(result).toBe(false);
    });

    it("should return false for an empty password", async () => {
        const result = await checkPasswordHash("", hash1);
        expect(result).toBe(false);
    });

    it("should return false for an invalid hash", async () => {
        const result = await checkPasswordHash(password1, "invalidhash");
        expect(result).toBe(false);
    });
});

describe("JWT Functions", () => {
    const secret = "secret";
    const wrongSecret = "wrong_secret";
    const userID = "some-unique-user-id";
    let validToken: string;
    let expiredToken: string;

    beforeAll(() => {
        validToken = makeJWT(userID, 3600, secret);
        expiredToken = makeJWT(userID, -3600, secret);
    });

    it("should validate a valid token", () => {
        const result = validateJWT(validToken, secret);
        expect(result).toBe(userID);
    });

    it("should throw an error for an invalid token", () => {
        expect(() => { validateJWT("bad-token", secret) })
            .toThrow(UnauthorizedError);
    });

    it("should throw an error when the token is signed with a wrong secret", () => {
        expect(() => { validateJWT(validToken, wrongSecret) })
            .toThrow(UnauthorizedError);
    });

    it("should throw an error for expired tokens", () => {
        expect(() => { validateJWT(expiredToken, secret) })
            .toThrow(jwt.TokenExpiredError);
    });
});

describe("Token Functions", () => {

    const req: Partial<Request> = {
        headers:{
            authorization: "Bearer my-secret-token",
        },
        get: function(name:string){
            return (this.headers as Record<string, any>)[name.toLowerCase()];
        }
    }
    const req2: Partial<Request> = {
        headers:{
            authorization: "Bearer my-other-secret-token",
        },
        get: function(name:string){
            return (this.headers as Record<string, any>)[name.toLowerCase()];
        }
    }
    const badReq: Partial<Request> = {
        headers:{
            authorization: undefined,
        },
        get: function(name:string){
            return (this.headers as Record<string, any>)[name.toLowerCase()];
        }
    }
    const badReq2: Partial<Request> = {
        headers:{},
        get: function(name:string){
            return (this.headers as Record<string, any>)[name.toLowerCase()];
        }
    }
    
    it("should validate a valid token", () => {
        const result = getBearerToken(req as Request);
        expect(result).toBe("Bearer my-secret-token");
    });
    
    it("should validate a valid token", () => {
        const result = getBearerToken(req2 as Request);
        expect(result).toBe("Bearer my-other-secret-token");
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { getBearerToken(badReq as Request) })
            .toThrow(BadRequestError);
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { getBearerToken(badReq2 as Request) })
            .toThrow(BadRequestError);
    });
});