import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { BadRequestException, ConflictException } from "@exceptions";
import { UserService } from "@services";
import { Bcrypt } from "@providers";

class UserController {
    public async register(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        try {
            /* maybe return 200 status code in case of a public auth api */
            if (await UserService.existsByEmail(email))
                throw new ConflictException("Email already registered.");

            const user = await UserService.create(
                email,
                await Bcrypt.hash(password),
            );

            const { password: _, ...data } = user;
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    public login(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local", function (err, user, info) {
            if (err) return next(err);
            if (!user) return next(new BadRequestException());

            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.status(200).json("Successfully connected.");
            });
        })(req, res, next);
    }

    public logout(req: Request, res: Response, next: NextFunction) {
        req.logout(function (err) {
            if (err) return next(err);
            return res.status(204).send();
        });
    }
}

export default new UserController();
