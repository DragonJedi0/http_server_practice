import { Response } from "express";

/**
 * Standardizes all successful JSON responses.
 * By using this instead of res.json() directly, we ensure every 
 * response in our app follows the same formatting rules.
 */
export function respondWithJSON(res: Response, code: number, payload: any) {
    // Express's .json() method automatically sets the Content-Type header
    // and stringifies the object for us, keeping things tidy.
    res.status(code).json(payload);
}

/**
 * Ensures all error messages are returned in a consistent object format.
 * This prevents the frontend from having to guess if the error is a 
 * string, an object, or an array.
 */
export function respondWithError(res: Response, code: number, message: string) {
    respondWithJSON(res, code, { error: message });
}