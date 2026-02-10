import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { Post } from "../lib/db/schema.js";
import { createPost } from "../lib/db/queries/posts.js";

export async function handlerPostChirp(req: Request, res: Response) {
    type parameters = {
        body: string,
        userId: string,
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

    const post: Post = {
        body: cleanedBody,
        userId: params.userId,
    }

    const result = await createPost(post);
    
    res.status(201).send({
        "id": result.id,
        "createdAt": result.createdAt,
        "updatedAt": result.updatedAt,
        "body": result.body,
        "userId": result.userId,
    });
}