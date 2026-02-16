import { Request, Response } from "express";
import { getBearerToken, makeJWT, validateJWT } from "./auth.js";
import { getRefreshToken, getUserFromRefreshToken, revokeRefreshToken } from "../lib/db/queries/refreshTokens.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

export async function handlerRefreshToken(req: Request, res: Response) {
    const jwt = config.jwt;
    const authToken = getBearerToken(req);
    const result = await getUserFromRefreshToken(authToken);
    if(!result){
        console.log("User not found");
        throw new UnauthorizedError("Invalid refresh token");
    }
    const user = result.user;
    const refreshToken = await getRefreshToken(authToken);
    const currentTime = new Date();

    if(refreshToken.revokedAt !== null){
        console.log("Refresh token revoked");
        throw new UnauthorizedError("Unauthorized access");
    }

    if(refreshToken.expiresAt &&
        (currentTime > refreshToken.expiresAt)){
        console.log("Refresh token expired");
        throw new UnauthorizedError("Unauthorized access");
    }

    const token = makeJWT(user.id, jwt.defaultDuration, jwt.secret);

    respondWithJSON(res, 200, { token: token });
}

export async function handlerRevokeToken(req: Request, res: Response) {
    const authToken = getBearerToken(req);
    const user = await getUserFromRefreshToken(authToken);
    if(!user){
        console.log("User not found");
        throw new NotFoundError("User not found");
    }

    try {
        await revokeRefreshToken(authToken);
    } catch {
        console.log("Refresh token not found");
        throw new NotFoundError("Not found");
    }

    res.status(204).send();
}