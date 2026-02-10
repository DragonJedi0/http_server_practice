import { Request, Response } from "express";
import { BadRequestError } from "../api/errors.js";
import { createUser } from "../lib/db/queries/users.js";
import { NewUser } from "../lib/db/schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string,
    };

    // req.body is automatically parsed via app.use(express.json())
    const params: parameters = req.body;

    //validate email syntax
    if(!params.email.includes("@")){
        throw new BadRequestError("Invaild email");
    }

    const user: NewUser = {
        email: params.email
    };

    const result = await createUser(user);

    res.status(201).send({
        "id": result.id,
        "createdAt": result.createdAt,
        "updatedAt": result.updatedAt,
        "email": result.email
    });
}