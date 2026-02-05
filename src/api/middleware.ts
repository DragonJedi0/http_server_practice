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
        config.fileServerHits += 1;
    });
    next();
}

// Print server hits
export async function middlewarePrintMetrics(req: Request, res: Response, next: NextFunction) {
    console.log(`Hits: ${config.fileServerHits}`);
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${config.fileServerHits}`);
}

// Reset server hits
export async function middlewareReset(req: Request, res: Response, next: NextFunction) {
    config.fileServerHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("Hits reset to 0");
}