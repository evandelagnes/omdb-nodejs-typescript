import { BadRequestException } from "@exceptions";
import { NextFunction, Request, Response } from "express";

class AuthMiddleware {
    public isOMDBApiKey(req: Request, res: Response, next: NextFunction) {
        try {
            // throw bad request exception if no key has been provided
            if (!req.headers["authorization"])
                throw new BadRequestException("Provide OMDB Api Key.");

            // split authorization and get index 1 to get the token
            // e.g. Bearer <TOKEN>
            const token = req.headers["authorization"].split(" ");
            if (token.length <= 1)
                throw new BadRequestException("Provide OMDB Api Key.");
            req.omdb_api_key = token.at(1);

            return next();
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthMiddleware();
