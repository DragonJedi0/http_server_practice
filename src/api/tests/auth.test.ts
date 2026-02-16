import { beforeAll, describe, expect, it } from "vitest";
import { checkPasswordHash, extractAPIKey, extractBearerToken, hashPassword, makeJWT, validateJWT } from "../auth.js";
import { BadRequestError, UnauthorizedError } from "../errors.js";
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
    const header = "Bearer my-secret-token";
    const header2 = "Bearer my-other-secret-token";
    const badHeader = "invalid header";
    const badHeader2 = "Bearer";
    const badHeader3 = "";
    
    it("should validate a valid token", () => {
        const result = extractBearerToken(header);
        expect(result).toBe("my-secret-token");
    });
    
    it("should validate a valid token", () => {
        const result = extractBearerToken(header2);
        expect(result).toBe("my-other-secret-token");
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { extractBearerToken(badHeader) })
            .toThrow(BadRequestError);
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { extractBearerToken(badHeader2) })
            .toThrow(BadRequestError);
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { extractBearerToken(badHeader3) })
            .toThrow(BadRequestError);
    });
});

describe("API Key Functions", () => {
    const header = "ApiKey VALID_KEY";
    const header2 = "ApiKey OTHER_VALID_KEY";
    const badHeader = "invalid header";
    const badHeader2 = "ApiKey";
    const badHeader3 = "";
    
    it("should validate a valid API Key", () => {
        const result = extractAPIKey(header);
        expect(result).toBe("VALID_KEY");
    });
    
    it("should validate a valid API Key", () => {
        const result = extractAPIKey(header2);
        expect(result).toBe("OTHER_VALID_KEY");
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { extractAPIKey(badHeader) })
            .toThrow(BadRequestError);
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { extractAPIKey(badHeader2) })
            .toThrow(BadRequestError);
    });
    
    it("should throw an error for missing headers", () => {
        expect(() => { extractAPIKey(badHeader3) })
            .toThrow(BadRequestError);
    });
});