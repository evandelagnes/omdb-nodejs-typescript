import { UnauthorizedException } from "@exceptions";
import { NextFunction, Request, Response, Express } from "express";
import { Passport as PassportProvider } from "@providers";

class PassportMiddleware {
    public mount() {
        PassportProvider.serialize();
        PassportProvider.deserialize();

        PassportProvider.localStrategy();
    }

    public isAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) return next();
        return next(new UnauthorizedException("You must be authenticated."));
    }
}

export default new PassportMiddleware();
