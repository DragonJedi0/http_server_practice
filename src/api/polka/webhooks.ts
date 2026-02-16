import { Request, Response } from "express";
import { NotFoundError } from "../../api/errors.js";
import { upgradeUserToRed } from "../../lib/db/queries/users.js"

export async function handlerUpgradeUserToRed(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    }

    const params: parameters = req.body;

    if(params.event == "user.upgraded"){
        try{
            await upgradeUserToRed(params.data.userId);
            console.log(`User successfully upgraded to red`);
        } catch {
            console.log("unable to upgrade user to red");
            throw new NotFoundError("404 User Not found");
        }
    }

    res.status(204).send();
}