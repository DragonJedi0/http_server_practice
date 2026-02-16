import { Request, Response } from "express";
import { ForbiddenError, NotFoundError } from "../../api/errors.js";
import { upgradeUserToRed } from "../../lib/db/queries/users.js"
import { getAPIKey } from "../auth.js";
import { config } from "../../config.js";

export async function handlerUpgradeUserToRed(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    }

    const apiKey = getAPIKey(req);
    if(apiKey != config.api.polkaKey){
        console.log("API Key Invalid");
        throw new ForbiddenError("Forbidden");
    }
    const params: parameters = req.body;

    if(params.event == "user.upgraded"){
        try{
            await upgradeUserToRed(params.data.userId);
            console.log(`User successfully upgraded to red`);
        } catch {
            console.log("unable to upgrade user to red");
            throw new NotFoundError("User Not found");
        }
    }

    res.status(204).send();
}