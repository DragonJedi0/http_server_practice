import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string,
    };

    // req.body is automatically parsed via app.use(express.json())
    const params: parameters = req.body;

    // Check if length is greater than 140
    if(params.body.length > 140){
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    // Check if body has restricted words
    let cleanedBody = params.body;
    let cleanedList: string[] = [];
    const wordList = params.body.split(" ");
    if(wordList.includes("kerfuffle") ||
        wordList.includes("sharbert") ||
        wordList.includes("fornax")){
            for (const word of wordList){
                switch (word.toLowerCase()){
                    case "kerfuffle":
                        cleanedList.push("****");
                        break;
                    case "sharbert":
                        cleanedList.push("****");
                        break;
                    case "fornax":
                        cleanedList.push("****");
                        break;
                    
                    default:
                        cleanedList.push(word);
                }
            }
            cleanedBody = cleanedList.join(" ");
        }

    const valid = JSON.stringify({ "cleanedBody": cleanedBody });
    res.status(200).send(valid);
}