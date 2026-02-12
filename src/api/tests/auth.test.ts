import { beforeAll, describe, expect, it } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "../auth.js";
import { UnauthorizedError } from "../errors.js";
import jwt from "jsonwebtoken";

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
    let futureToken: string;

    beforeAll(() => {
        validToken = makeJWT(userID, 3600, secret);
        expiredToken = makeJWT(userID, -3600, secret);
        futureToken = makeJWT(userID, 7200, secret);
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