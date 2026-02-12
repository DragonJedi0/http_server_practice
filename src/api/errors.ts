import { NextFunction, Request, Response } from "express";
import { respondWithError } from "./json.js";
import jwt from "jsonwebtoken";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string){
        super(message);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string){
        super(message);
    }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err.message);
    if(err instanceof BadRequestError){
        respondWithError(res, 400, err.message);
    } else if(err instanceof UnauthorizedError){
        respondWithError(res, 401, err.message);
    } else if(err instanceof ForbiddenError){
        respondWithError(res, 403, err.message);
    } else if(err instanceof NotFoundError){
        respondWithError(res, 404, err.message);
    } else if (err instanceof jwt.TokenExpiredError){
        respondWithError(res, 498, `${err.message} at ${err.expiredAt}`);
    } else {
        respondWithError(res, 500, "Internal Server Error");
    }
}