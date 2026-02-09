import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    // let body = ""; // Initialize

    // // Listen for data events
    // req.on("data", (chunk) => {
    //     body += chunk;
    // });

    // // Listen for events
    // req.on("end", () => {
    //     try{
    //         res.header("Content-Type", "application/json");
    //         const parsedBody = JSON.parse(body);
    //         if(parsedBody.body.length >= 140){
    //             const error = JSON.stringify({ "error": "Chirp is too long" });
    //             res.status(400).send(error);
    //         } else {
    //             const valid = JSON.stringify({ "valid": true });
    //             res.status(200).send(valid);
    //         }
    //     } catch (error) {
    //         res.status(400).send("Invalid JSON");
    //     }
    // });

    type parameters = {
        body: string,
    };

    // req.body is automatically parsed via app.use(express.json())
    const params: parameters = req.body;

    // Check if length is greater than 140
    if(params.body.length > 140){
        // const error = JSON.stringify({ "error": "Chirp is too long" });
        // res.status(400).send(error);
        // return;
        throw new Error("Chirp is too long");
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