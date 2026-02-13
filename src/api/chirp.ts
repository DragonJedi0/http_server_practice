import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { createChirp, getAllChirps, getChirpById } from "../lib/db/queries/chirps.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

export async function handlerPostChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    // req.body is automatically parsed via app.use(express.json())
    const params: parameters = req.body;
    // Get token from body
    // Remember that 'authorization' header always start with 'Bearer'
    const token = getBearerToken(req).slice(7);
    // Get userID from JWT
    const userID = validateJWT(token, config.secret);

    // createChirp returns new object added to database
    // validateChirp ensures that the post follows guidelines
    // Passing inline Chirp object rather than creating an object variable
    const chirp = await createChirp({
        body: validateChirp(params.body),
        userId: userID,
    });

    // Throw Error if undefined
    if(!chirp){
        throw new Error("Could not create chirp");
    }
    console.log(`Post succecfully added for user ${userID}`);
    respondWithJSON(res, 201, chirp);
}

function validateChirp(body: string){
    const maxChirpLength = 140;
    if(body.length > maxChirpLength){
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const restrictedWords = ["kerfuffle", "sharbert", "fornax"];
    return getCleanedBody(body, restrictedWords);
}

function getCleanedBody(body: string, restrictedWords: string[]){
    const words = body.split(" ");
    for (let i = 0; i < words.length; i++){
        const word = words[i].toLowerCase();
        if(restrictedWords.includes(word)){
            words[i] = "****";
        }
    }
    const cleaned = words.join(" ");
    return cleaned;
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const chirps = await getAllChirps();
    respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirpByID(req: Request, res: Response) {
    // 1. Define the shape of the data coming from the URL
    type PathParams = {
        chirpId: string;
    };

    // 2. Identify the source (req.params for URL, req.body for JSON)
    const params = req.params as PathParams;
    const chirpId = params.chirpId;

    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with ID ${chirpId} not found`);
    }

    respondWithJSON(res, 200, chirp);
}