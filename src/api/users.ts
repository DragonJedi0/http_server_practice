import { Request, Response } from "express";
import { BadRequestError } from "../api/errors.js";
import { createUser } from "../lib/db/queries/users.js";
import { respondWithJSON } from "./json.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string,
    };

    // req.body is automatically parsed via app.use(express.json())
    const params: parameters = req.body;

    if(!params.email){
        throw new BadRequestError("Invaild email");
    }
    // TODO: validate email syntax

    const user = await createUser({ email: params.email });
    if(!user){
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, user);
}