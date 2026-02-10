import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

// Print server hits
export async function middlewarePrintMetrics(req: Request, res: Response, next: NextFunction) {
    console.log(`Hits: ${config.api.fileServerHits}`);
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<h1>Welcome, Chirpy Admin</h1><p>Chirpy has been visited ${config.api.fileServerHits} times!</p>`);
}