import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

// Logs status codes
export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", ()=>{
        if(res.statusCode >= 300){
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });

    next();
}

// Log server hits
export async function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        config.api.fileServerHits += 1;
    });
    next();
}