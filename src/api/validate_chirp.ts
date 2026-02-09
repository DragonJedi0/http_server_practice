import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    let body = ""; // Initialize

    // Listen for data events
    req.on("data", (chunk) => {
        body += chunk;
    });

    // Listen for events
    req.on("end", () => {
        try{
            res.header("Content-Type", "application/json");
            const parsedBody = JSON.parse(body);
            if(parsedBody.body.length >= 140){
                const error = JSON.stringify({ "error": "Chirp is too long" });
                res.status(400).send(error);
            } else {
                const valid = JSON.stringify({ "valid": true });
                res.status(200).send(valid);
            }
        } catch (error) {
            res.status(400).send("Invalid JSON");
        }
    });
}