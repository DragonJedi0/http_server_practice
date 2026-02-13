import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../lib/db/queries/users.js";
import { ForbiddenError } from "./errors.js";

export async function middlewareReset(req: Request, res: Response, next: NextFunction) {
    // Ensure admin is in DEV environment.
    if(config.api.platform !== "dev"){
        throw new ForbiddenError("Forbidden");
    }

    // Reset server data
    config.api.fileServerHits = 0;
    await deleteAllUsers();

    const results = [
        "Hits reset to 0",
        "Users table cleared",
        "Posts table cleared",
        "Refresh Tokens table cleared"
    ];

    for (const result of results){
        console.log(result);
    }
    
    res.send(results.join("\n"));
}