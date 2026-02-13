import e, { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../api/errors.js";
import { createUser, getUserByEmail } from "../lib/db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, hashPassword, makeJWT } from "./auth.js";
import { NewUser } from "../lib/db/schema.js";
import { config } from "../config.js";

// Create a response type to prevent hashedPassword from being transmitted
type UserResponse = Omit<NewUser, "hashedPassword"> & {
    token?: string;
};

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };

    // req.body is automatically parsed via app.use(express.json())
    const params: parameters = req.body;

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
        email: user.email
    }
    respondWithJSON(res, 201, securedUser);
}

export async function handlerLogIn(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
        expiresInSeconds?: number;
    };
    // req.body is automatically parsed via app.use(express.json())
    const params: parameters = req.body;

    // find user by email
    const user = await getUserByEmail(params.email);

    // if user not found or checkPasswordHash returns false
    if(!user || !await checkPasswordHash(params.password, user.hashedPassword)){
        throw new UnauthorizedError("Incorrect email or password");
    }

    // Create token based on client expiration time
    const expires = isValidExpiration(params.expiresInSeconds) ? params.expiresInSeconds : 3600;

    const token = makeJWT(user.id, expires, config.secret);

    const securedUser: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token
    }
    console.log(`User with email ${securedUser.email} successfully logged in`);
    respondWithJSON(res, 200, securedUser);
}

function isValidExpiration(value: unknown): value is number{
    return typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 3600;
}