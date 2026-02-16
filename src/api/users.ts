import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../api/errors.js";
import { createUser, getUserByEmail, udpateUser } from "../lib/db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "./auth.js";
import { NewUser } from "../lib/db/schema.js";
import { config } from "../config.js";
import { createRefreshToken } from "../lib/db/queries/refreshTokens.js";

// Create a request type to get user credentials
type UserRequest = {
    email: string;
    password: string;
}

// Create a response type to prevent hashedPassword from being transmitted
type UserResponse = Omit<NewUser, "hashedPassword">;
type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
};

export async function handlerCreateUser(req: Request, res: Response) {
    // req.body is automatically parsed via app.use(express.json())
    const params: UserRequest = req.body;

    if(!params.email || !params.password){
        throw new BadRequestError("Missing required fields");
    }
    // TODO: validate email syntax

    // Passing inline User object rather than creating an object variable
    const user = await createUser({
        email: params.email,
        hashedPassword: await hashPassword(params.password),
    });
    if(!user){
        throw new Error("Could not create user");
    }

    const securedUser: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
    }
    respondWithJSON(res, 201, securedUser);
}

export async function handlerLogIn(req: Request, res: Response) {
    // req.body is automatically parsed via app.use(express.json())
    const params: UserRequest = req.body;
    if(!params.email || !params.password){
        throw new BadRequestError("Missing required fields");
    }

    // find user by email
    const user = await getUserByEmail(params.email);

    // if user not found or checkPasswordHash returns false
    if(!user || !await checkPasswordHash(params.password, user.hashedPassword)){
        throw new UnauthorizedError("Incorrect email or password");
    }

    // Create token based on default expiration time
    const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

    const result = makeRefreshToken();
    const refreshToken = await createRefreshToken({ 
        token: result.token,
        userId: user.id,
        expiresAt: result.expiration,
        revokedAt: null,
    });
    if(!refreshToken){
        throw new Error("Unable to create refresh token");
    }

    const securedUser: LoginResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
        token: token,
        refreshToken: refreshToken.token,
    }
    console.log(`User with email ${securedUser.email} successfully logged in`);
    respondWithJSON(res, 200, securedUser);
}

export async function handlerUpdateUser(req: Request, res: Response) {
    const params: UserRequest = req.body;
    if(!params.email || !params.password){
        throw new BadRequestError("Missing required fields");
    }

    const email = params.email;
    const password = params.password;

    const authToken = getBearerToken(req);

    const userId = validateJWT(authToken, config.jwt.secret);

    if(!userId){
        console.log("Invalid access token");
        throw new UnauthorizedError("Not Authorized");
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await udpateUser(userId, email, hashedPassword);
    if(!updatedUser){
        console.log("User is not authorized to make changes");
        throw new UnauthorizedError("Not Authorized");
    }

    const securedUser: UserResponse = {
        id: updatedUser.id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        email: updatedUser.email,
        isChirpyRed: updatedUser.isChirpyRed,
    }
    respondWithJSON(res, 200, securedUser);
}