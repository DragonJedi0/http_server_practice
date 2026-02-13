import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "./auth.js";
import { getUserFromRefreshToken, updateRefreshToken } from "../lib/db/queries/refreshTokens.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

export async function handlerRefreshToken(req: Request, res: Response) {
    const jwt = config.jwt;
    const authToken = getBearerToken(req);
    const refreshToken = await getUserFromRefreshToken(authToken);
    const currentTime = new Date();

    if(!refreshToken){
        console.log("Refresh token not found")
        throw new UnauthorizedError("Unauthorized access");
    }

    if(refreshToken.revokedAt !== null){
        console.log("Refresh token revoked");
        throw new UnauthorizedError("Unauthorized access");
    }

    if(refreshToken.expiresAt &&
        (currentTime > refreshToken.expiresAt)){
        console.log("Refresh token expired");
        throw new UnauthorizedError("Unauthorized access");
    }

    const token = makeJWT(refreshToken.userId, jwt.defaultDuration, jwt.secret);

    respondWithJSON(res, 200, { token: token });
}

export async function handlerRevokeToken(req: Request, res: Response) {
    const authToken = getBearerToken(req);
    const refreshToken = await getUserFromRefreshToken(authToken);
    if(!refreshToken){
        console.log("Refresh token not found");
        throw new NotFoundError("404 not found");
    }

    try {
        await updateRefreshToken(authToken);
    } catch {
        console.log("Refresh token not found");
        throw new NotFoundError("404 not found");
    }

    res.status(204).send();
}